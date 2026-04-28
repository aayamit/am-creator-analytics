import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/creators/campaigns - Get campaigns where creator is participating
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!creatorProfile) {
      return NextResponse.json({ campaigns: [] });
    }

    // Get campaigns where creator is participating
    const campaignCreators = await prisma.campaignCreator.findMany({
      where: { creatorId: creatorProfile.id },
      include: {
        campaign: {
          include: {
            brand: true,
          },
        },
        contract: true,
        deliverables: true,
      },
    });

    const campaigns = campaignCreators.map((cc) => ({
      id: cc.campaign.id,
      title: cc.campaign.title,
      status: cc.campaign.status,
      brand: {
        companyName: cc.campaign.brand.companyName,
      },
      campaignCreators: [
        {
          id: cc.id,
          rate: cc.rate,
          deliverables: cc.deliverables,
          contract: cc.contract
            ? {
                id: cc.contract.id,
                status: cc.contract.status,
              }
            : null,
        },
      ],
    }));

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Fetch creator campaigns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
