import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/campaigns/invites/[id]/accept - Creator accepts invite
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inviteId = params.id;

    // Get invite
    const invite = await prisma.campaignInvite.findUnique({
      where: { id: inviteId },
      include: {
        campaign: { include: { brand: true } },
        creator: { include: { user: true } },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Verify creator owns this invite
    if (invite.creator.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: `Invite already ${invite.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Check if invite expired
    if (new Date() > invite.expiresAt) {
      await prisma.campaignInvite.update({
        where: { id: inviteId },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Invite expired" }, { status: 400 });
    }

    // Update invite status
    const updatedInvite = await prisma.campaignInvite.update({
      where: { id: inviteId },
      data: {
        status: "ACCEPTED",
        respondedAt: new Date(),
      },
    });

    // Add creator to campaign
    const campaignCreator = await prisma.campaignCreator.create({
      data: {
        campaignId: invite.campaignId,
        creatorId: invite.creatorId,
        rate: invite.deliverables?.rate || 0,
        deliverables: invite.deliverables || null,
      },
    });

    // Create notification for brand
    await prisma.notification.create({
      data: {
        userId: invite.campaign.brand.userId,
        type: "CAMPAIGN_UPDATE",
        title: "Invite Accepted",
        message: `${invite.creator.displayName || invite.creator.user.name} accepted your campaign invite`,
        link: `/brands/campaigns/${invite.campaignId}`,
      },
    });

    return NextResponse.json({
      invite: updatedInvite,
      campaignCreator,
    });
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.json(
      { error: "Failed to accept invite" },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/invites/[id]/decline - Creator declines invite
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inviteId = params.id;

    // Get invite
    const invite = await prisma.campaignInvite.findUnique({
      where: { id: inviteId },
      include: {
        campaign: { include: { brand: true } },
        creator: { include: { user: true } },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Verify creator owns this invite
    if (invite.creator.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: `Invite already ${invite.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Update invite status
    const updatedInvite = await prisma.campaignInvite.update({
      where: { id: inviteId },
      data: {
        status: "DECLINED",
        respondedAt: new Date(),
      },
    });

    // Create notification for brand
    await prisma.notification.create({
      data: {
        userId: invite.campaign.brand.userId,
        type: "CAMPAIGN_UPDATE",
        title: "Invite Declined",
        message: `${invite.creator.displayName || invite.creator.user.name} declined your campaign invite`,
        link: `/brands/campaigns/${invite.campaignId}`,
      },
    });

    return NextResponse.json({ invite: updatedInvite });
  } catch (error) {
    console.error("Decline invite error:", error);
    return NextResponse.json(
      { error: "Failed to decline invite" },
      { status: 500 }
    );
  }
}
