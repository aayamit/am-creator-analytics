import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: true,
        campaignCreators: {
          include: {
            creator: {
              include: {
                user: true,
                socialAccounts: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      budget: campaign.budget.toNumber(),
      spent: campaign.spent.toNumber(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      objectives: campaign.objectives,
      brand: {
        id: campaign.brand.id,
        companyName: campaign.brand.companyName,
      },
      creators: campaign.campaignCreators.map((cc) => ({
        id: cc.id,
        creatorId: cc.creatorId,
        displayName: cc.creator.displayName,
        rate: cc.rate.toNumber(),
        paymentStatus: cc.paymentStatus,
        deliverables: cc.deliverables,
      })),
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, budget, spent } = body;

    // Fetch current campaign with relations
    const currentCampaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: true,
        campaignCreators: {
          include: {
            creator: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!currentCampaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (budget !== undefined) updateData.budget = parseFloat(budget);
    if (spent !== undefined) updateData.spent = parseFloat(spent);

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
    });

    // Send notifications if status changed
    if (status && status !== currentCampaign.status) {
      const statusMessages: Record<string, string> = {
        ACTIVE: "has started",
        PAUSED: "has been paused",
        COMPLETED: "has been completed",
        CANCELLED: "has been cancelled",
      };
      
      const message = statusMessages[status] || `status changed to ${status}`;
      
      // Notify brand
      const brandUser = await prisma.user.findUnique({
        where: { id: currentCampaign.brand.userId },
      });
      if (brandUser) {
        // createCampaignUpdateNotification call removed - implement if needed
        console.log(`Notify brand ${brandUser.id}: Campaign ${campaign.title} ${message}`);
      }
      
      // Notify all creators
      const creatorNotifications = currentCampaign.campaignCreators.map((cc) => {
        console.log(`Notify creator ${cc.creator.user.id}: Campaign ${campaign.title} ${message}`);
        return Promise.resolve();
      });
      await Promise.all(creatorNotifications);
    }

    return Response.json(campaign);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.campaign.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
