import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/campaigns/contracts/[id]/sign - Creator signs contract
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contractId = params.id;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        campaignCreator: {
          include: {
            creator: { include: { user: true } },
            campaign: { include: { brand: true } },
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Verify creator owns this contract
    if (contract.campaignCreator.creator.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (contract.status !== "SENT") {
      return NextResponse.json(
        { error: `Contract is ${contract.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: "SIGNED_BY_CREATOR",
        creatorSignedAt: new Date(),
        creatorIp: request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    // Notification to brand
    await prisma.notification.create({
      data: {
        userId: contract.campaignCreator.campaign.brand.userId,
        type: "MILESTONE_REACHED",
        title: "Contract Signed by Creator",
        message: `${contract.campaignCreator.creator.displayName} signed the contract`,
        link: `/brands/contracts/${contractId}`,
      },
    });

    return NextResponse.json({ contract: updated });
  } catch (error) {
    console.error("Sign contract error:", error);
    return NextResponse.json(
      { error: "Failed to sign contract" },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/contracts/[id]/brand-sign - Brand signs contract
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contractId = params.id;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        campaignCreator: {
          include: {
            creator: { include: { user: true } },
            campaign: { include: { brand: true } },
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Verify brand owns this contract
    if (contract.campaignCreator.campaign.brand.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (contract.status !== "SIGNED_BY_CREATOR") {
      return NextResponse.json(
        { error: "Creator must sign first" },
        { status: 400 }
      );
    }

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: "FULLY_EXECUTED",
        brandSignedAt: new Date(),
        brandIp: request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    // Notification to creator
    await prisma.notification.create({
      data: {
        userId: contract.campaignCreator.creator.userId,
        type: "MILESTONE_REACHED",
        title: "Contract Fully Executed",
        message: `Your contract for ${contract.campaignCreator.campaign.title} is now active!`,
        link: `/creators/contracts/${contractId}`,
      },
    });

    return NextResponse.json({ contract: updated });
  } catch (error) {
    console.error("Brand sign contract error:", error);
    return NextResponse.json(
      { error: "Failed to sign contract" },
      { status: 500 }
    );
  }
}
