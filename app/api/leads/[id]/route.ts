import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";
import { LeadStage } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/leads/[id] - Update lead stage (for drag-and-drop)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Forbidden: Brand access required" }, { status: 403 });
    }
    
    const { id } = await params;
    const body = await req.json();
    const { stage } = body;
    
    // Validate stage
    if (!Object.values(LeadStage).includes(stage as LeadStage)) {
      return NextResponse.json({ error: "Invalid lead stage" }, { status: 400 });
    }
    
    // Get brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }
    
    // Fetch lead and verify it belongs to this brand's campaign
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { campaign: true },
    });
    
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    
    if (lead.campaign.brandId !== brandProfile.id) {
      return NextResponse.json({ error: "Forbidden: Lead does not belong to your brand" }, { status: 403 });
    }
    
    // Update lead stage
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        stage: stage as LeadStage,
        ...(stage === "CLOSED_WON" || stage === "CLOSED_LOST" ? { convertedAt: new Date() } : {}),
      },
      include: {
        campaign: { select: { id: true, title: true } },
        creator: { select: { id: true, displayName: true } },
      },
    });
    
    // Log compliance audit
    await prisma.complianceAudit.create({
      data: {
        userId: session.user.id,
        action: "LEAD_UPDATED",
        resource: `Lead:${id}`,
        resourceType: "Lead",
        resourceId: id,
        before: { stage: lead.stage },
        after: { stage: updatedLead.stage },
      },
    });
    
    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
