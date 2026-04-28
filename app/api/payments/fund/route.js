import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/payments/fund - Add funds to a campaign
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Forbidden: Brand access required" }, { status: 403 });
    }
    
    const body = await req.json();
    const { campaignId, amount } = body;
    
    if (!campaignId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid campaign ID or amount" }, { status: 400 });
    }
    
    // Get brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }
    
    // Verify campaign belongs to this brand
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        brandId: brandProfile.id,
      },
    });
    
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    
    // In a real implementation, this is where you'd:
    // 1. Charge the brand via Stripe/PayPal
    // 2. On success, update the campaign budget
    // 3. Log the transaction
    
    // For now, we'll just update the budget
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        budget: { increment: amount },
      },
    });
    
    // Log compliance audit
    await prisma.complianceAudit.create({
      data: {
        userId: session.user.id,
        action: "CAMPAIGN_FUNDED",
        resource: `Campaign:${campaignId}`,
        resourceType: "Campaign",
        resourceId: campaignId,
        before: { budget: campaign.budget.toNumber() },
        after: { budget: updatedCampaign.budget.toNumber() },
        metadata: {
          amountAdded: amount,
          method: "STRIPE", // This would come from actual payment
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      campaign: {
        id: updatedCampaign.id,
        budget: updatedCampaign.budget.toNumber(),
      },
    });
    
  } catch (error) {
    console.error("Campaign funding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
