import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/payments/payout - Pay a creator for a campaign
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
    const { campaignCreatorId, method = "STRIPE" } = body;
    
    if (!campaignCreatorId) {
      return NextResponse.json({ error: "Campaign creator ID required" }, { status: 400 });
    }
    
    // Get brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }
    
    // Get campaign creator details
    const campaignCreator = await prisma.campaignCreator.findUnique({
      where: { id: campaignCreatorId },
      include: {
        campaign: true,
        creator: {
          include: { payoutAccount: true },
        },
      },
    });
    
    if (!campaignCreator) {
      return NextResponse.json({ error: "Campaign creator not found" }, { status: 404 });
    }
    
    // Verify campaign belongs to this brand
    if (campaignCreator.campaign.brandId !== brandProfile.id) {
      return NextResponse.json({ error: "Forbidden: Not your campaign" }, { status: 403 });
    }
    
    // Check if creator has payout account
    if (!campaignCreator.creator.payoutAccount) {
      return NextResponse.json(
        { error: "Creator has not set up payout account" },
        { status: 400 }
      );
    }
    
    const payoutAccount = campaignCreator.creator.payoutAccount;
    const amount = campaignCreator.rate.toNumber();
    const platformFee = amount * 0.05; // 5% platform fee
    const netAmount = amount - platformFee;
    
    // Create payout transaction record
    const transaction = await prisma.payoutTransaction.create({
      data: {
        payoutAccountId: payoutAccount.id,
        campaignId: campaignCreator.campaignId,
        campaignCreatorId: campaignCreator.id,
        amount,
        currency: payoutAccount.currency,
        fee: platformFee,
        netAmount,
        provider: payoutAccount.provider,
        status: "PROCESSING",
        description: `Payment for ${campaignCreator.campaign.title}`,
      },
    });
    
    // In real implementation, trigger actual payout via Stripe/Razorpay here
    // For now, simulate successful payout
    setTimeout(async () => {
      await prisma.payoutTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "PAID",
          processedAt: new Date(),
          providerTxId: `sim_${Date.now()}`,
          metadata: {
            simulated: true,
            method: payoutAccount.provider,
          },
        },
      });
      
      // Update campaign creator payment status
      await prisma.campaignCreator.update({
        where: { id: campaignCreatorId },
        data: { paymentStatus: "PAID" },
      });
    }, 2000);
    
    // Update campaign spent amount
    await prisma.campaign.update({
      where: { id: campaignCreator.campaignId },
      data: {
        spent: { increment: amount },
      },
    });
    
    // Log compliance audit
    await prisma.complianceAudit.create({
      data: {
        userId: session.user.id,
        action: "CREATOR_PAID",
        resource: `CampaignCreator:${campaignCreatorId}`,
        resourceType: "CampaignCreator",
        resourceId: campaignCreatorId,
        after: {
          amount,
          platformFee,
          netAmount,
          transactionId: transaction.id,
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount,
        fee: platformFee,
        netAmount,
        status: "PROCESSING",
      },
    });
    
  } catch (error) {
    console.error("Payout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
