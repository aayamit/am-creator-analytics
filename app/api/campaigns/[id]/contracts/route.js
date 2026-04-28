import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/campaigns/[id]/contracts - Brand generates a contract
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaignId = params.id;
    const body = await request.json();
    const { campaignCreatorId, type = "STANDARD", terms } = body;

    if (!campaignCreatorId) {
      return NextResponse.json({ error: "Missing campaignCreatorId" }, { status: 400 });
    }

    // Verify brand owns this campaign
    const campaignCreator = await prisma.campaignCreator.findFirst({
      where: {
        id: campaignCreatorId,
        campaign: {
          id: campaignId,
          brand: { userId: session.user.id },
        },
      },
      include: {
        campaign: { include: { brand: true } },
        creator: { include: { user: true } },
      },
    });

    if (!campaignCreator) {
      return NextResponse.json({ error: "Campaign creator not found" }, { status: 404 });
    }

    // Check for existing contract
    const existing = await prisma.contract.findUnique({
      where: { campaignCreatorId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Contract already exists" },
        { status: 400 }
      );
    }

    // Generate contract content
    const contractContent = generateContractContent({
      brandName: campaignCreator.campaign.brand.companyName,
      creatorName: campaignCreator.creator.displayName,
      campaignTitle: campaignCreator.campaign.title,
      rate: campaignCreator.rate,
      deliverables: campaignCreator.deliverables,
      terms,
    });

    const contract = await prisma.contract.create({
      data: {
        campaignCreatorId,
        type,
        status: "DRAFT",
        terms: terms || null,
        contentUrl: contractContent,
      },
    });

    return NextResponse.json({ contract });
  } catch (error) {
    console.error("Create contract error:", error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/[id]/contracts - Brand sends contract to creator
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaignId = params.id;
    const body = await request.json();
    const { contractId } = body;

    if (!contractId) {
      return NextResponse.json({ error: "Missing contractId" }, { status: 400 });
    }

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

    if (contract.status !== "DRAFT") {
      return NextResponse.json(
        { error: `Contract already ${contract.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: "SENT",
      },
    });

    // Notification to creator
    await prisma.notification.create({
      data: {
        userId: contract.campaignCreator.creator.userId,
        type: "CAMPAIGN_UPDATE",
        title: "Contract Sent",
        message: `You have a new contract to sign for ${contract.campaignCreator.campaign.title}`,
        link: `/creators/contracts/${contractId}`,
      },
    });

    return NextResponse.json({ contract: updated });
  } catch (error) {
    console.error("Send contract error:", error);
    return NextResponse.json(
      { error: "Failed to send contract" },
      { status: 500 }
    );
  }
}

// Helper to generate contract content
function generateContractContent({
  brandName,
  creatorName,
  campaignTitle,
  rate,
  deliverables,
  terms,
}) {
  return `
    CONTRACT AGREEMENT

    Between: ${brandName} ("Brand")
    And: ${creatorName} ("Creator")

    Campaign: ${campaignTitle}

    DELIVERABLES:
    ${JSON.stringify(deliverables, null, 2)}

    COMPENSATION:
    Total Rate: $${rate}

    TERMS & CONDITIONS:
    ${terms || "Standard terms apply"}

    Generated on: ${new Date().toISOString()}
  `.trim();
}
