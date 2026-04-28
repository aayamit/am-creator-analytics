import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/campaigns/[id]/invites - Brand invites a creator
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaignId = params.id;
    const body = await request.json();
    const { creatorId, message, deliverables, rate } = body;

    if (!creatorId) {
      return NextResponse.json({ error: "Missing creatorId" }, { status: 400 });
    }

    // Verify brand owns this campaign
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        brand: { userId: session.user.id },
      },
      include: { brand: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Check if creator exists
    const creator = await prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      include: { user: true },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // Check for existing invite
    const existingInvite = await prisma.campaignInvite.findUnique({
      where: {
        campaignId_creatorId: {
          campaignId,
          creatorId,
        },
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "Invite already sent to this creator" },
        { status: 400 }
      );
    }

    // Check if creator is already in campaign
    const existingCreator = await prisma.campaignCreator.findUnique({
      where: {
        campaignId_creatorId: {
          campaignId,
          creatorId,
        },
      },
    });

    if (existingCreator) {
      return NextResponse.json(
        { error: "Creator already in campaign" },
        { status: 400 }
      );
    }

    // Create invite
    const invite = await prisma.campaignInvite.create({
      data: {
        campaignId,
        creatorId,
        invitedBy: session.user.id,
        message,
        deliverables: deliverables || null,
      },
    });

    // Create notification for creator
    await prisma.notification.create({
      data: {
        userId: creator.user.id,
        type: "CAMPAIGN_INVITE",
        title: `Invited to ${campaign.title}`,
        message: message || `You've been invited to participate in a campaign`,
        link: `/creators/campaigns/${campaignId}`,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "INVITE_CREATOR",
        resource: `Campaign:${campaignId}`,
        metadata: {
          creatorId,
          inviteId: invite.id,
        },
      },
    });

    return NextResponse.json({ invite });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}

// GET /api/campaigns/[id]/invites - List invites for a campaign
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaignId = params.id;

    // Verify brand owns the campaign
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        brand: { userId: session.user.id },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const invites = await prisma.campaignInvite.findMany({
      where: { campaignId },
      include: {
        creator: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        inviter: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("List invites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}
