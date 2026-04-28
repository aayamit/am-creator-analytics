import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/campaigns/[id]/deliverables - Creator submits a deliverable
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaignId = params.id;
    const body = await request.json();
    const { campaignCreatorId, type, title, description, platform, dueDate } = body;

    if (!campaignCreatorId || !type || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify creator is part of this campaign
    const campaignCreator = await prisma.campaignCreator.findFirst({
      where: {
        id: campaignCreatorId,
        campaignId,
        creator: { userId: session.user.id },
      },
      include: { campaign: { include: { brand: true } } },
    });

    if (!campaignCreator) {
      return NextResponse.json({ error: "Not authorized for this campaign" }, { status: 403 });
    }

    const deliverable = await prisma.deliverable.create({
      data: {
        campaignCreatorId,
        type,
        title,
        description,
        platform,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "PENDING",
      },
    });

    // Notification to brand
    await prisma.notification.create({
      data: {
        userId: campaignCreator.campaign.brand.userId,
        type: "CAMPAIGN_UPDATE",
        title: "Deliverable Added",
        message: `A new ${type.toLowerCase()} deliverable was added to your campaign`,
        link: `/brands/campaigns/${campaignId}`,
      },
    });

    return NextResponse.json({ deliverable });
  } catch (error) {
    console.error("Create deliverable error:", error);
    return NextResponse.json(
      { error: "Failed to create deliverable" },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/deliverables/[id]/submit - Creator submits for review
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deliverableId = params.id;
    const body = await request.json();
    const { contentUrl, previewUrl } = body;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: {
        campaignCreator: {
          include: {
            creator: { include: { user: true } },
            campaign: { include: { brand: true } },
          },
        },
      },
    });

    if (!deliverable) {
      return NextResponse.json({ error: "Deliverable not found" }, { status: 404 });
    }

    // Verify creator owns this deliverable
    if (deliverable.campaignCreator.creator.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        contentUrl,
        previewUrl,
      },
    });

    // Notification to brand
    await prisma.notification.create({
      data: {
        userId: deliverable.campaignCreator.campaign.brand.userId,
        type: "MILESTONE_REACHED",
        title: "Deliverable Submitted",
        message: `A deliverable has been submitted for review`,
        link: `/brands/campaigns/${deliverable.campaignCreator.campaignId}`,
      },
    });

    return NextResponse.json({ deliverable: updated });
  } catch (error) {
    console.error("Submit deliverable error:", error);
    return NextResponse.json(
      { error: "Failed to submit deliverable" },
      { status: 500 }
    );
  }
}

// PATCH /api/campaigns/deliverables/[id]/approve - Brand approves deliverable
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deliverableId = params.id;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: {
        campaignCreator: {
          include: {
            creator: { include: { user: true } },
            campaign: { include: { brand: true } },
          },
        },
      },
    });

    if (!deliverable) {
      return NextResponse.json({ error: "Deliverable not found" }, { status: 404 });
    }

    // Verify brand owns this campaign
    if (deliverable.campaignCreator.campaign.brand.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    // Notification to creator
    await prisma.notification.create({
      data: {
        userId: deliverable.campaignCreator.creator.userId,
        type: "CAMPAIGN_UPDATE",
        title: "Deliverable Approved",
        message: `Your deliverable has been approved!`,
        link: `/creators/campaigns/${deliverable.campaignCreator.campaignId}`,
      },
    });

    return NextResponse.json({ deliverable: updated });
  } catch (error) {
    console.error("Approve deliverable error:", error);
    return NextResponse.json(
      { error: "Failed to approve deliverable" },
      { status: 500 }
    );
  }
}
