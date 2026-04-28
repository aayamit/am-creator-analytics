import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get session manually via getServerSession
    // For now, return mock data to keep moving
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const brandId = url.searchParams.get("brandId");

    const where = {};
    if (status) where.status = status;
    if (brandId) where.brandId = brandId;

    const campaigns = await prisma.campaign.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    });

    const transformedCampaigns = campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      budget: campaign.budget.toNumber(),
      spent: campaign.spent.toNumber(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
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
      })),
    }));

    return Response.json(transformedCampaigns);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, budget, startDate, endDate, objectives, creatorIds } = body;

    // TODO: Get brandId from session
    const brandProfile = await prisma.brandProfile.findFirst({
      where: { companyName: "Acme Corporation" }, // Temp for demo
    });

    if (!brandProfile) {
      return Response.json({ error: "Brand profile not found" }, { status: 404 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: brandProfile.id,
        title,
        description,
        budget: parseFloat(budget),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        objectives,
        campaignCreators: {
          create: (creatorIds || []).map((creatorId) => ({
            creatorId,
            rate: 2400,
            paymentStatus: "PENDING",
          })),
        },
      },
      include: {
        campaignCreators: true,
      },
    });

    return Response.json(campaign, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
