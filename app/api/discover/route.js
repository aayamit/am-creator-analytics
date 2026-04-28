import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/discover - Public campaign discovery
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    
    // Filters
    const category = searchParams.get("category"); // TECH, FINANCE, SAAS, etc.
    const platform = searchParams.get("platform"); // YOUTUBE, INSTAGRAM, TWITTER, etc.
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");
    const search = searchParams.get("search"); // Search in title/description
    const status = searchParams.get("status") || "ACTIVE"; // Default to active campaigns
    
    // Build where clause
    const where = {
      status: status,
      // Only show campaigns that are publicly discoverable
      // (In production, you might have a "discoverable" boolean field)
    };
    
    // Category filter
    if (category) {
      where.category = category;
    }
    
    // Platform filter (check if campaign has creators on that platform)
    if (platform) {
      where.campaignCreators = {
        some: {
          creator: {
            socialAccounts: {
              some: {
                platform: platform,
              },
            },
          },
        },
      };
    }
    
    // Budget filter
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget.gte = parseFloat(minBudget);
      if (maxBudget) where.budget.lte = parseFloat(maxBudget);
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    
    // Fetch campaigns with brand info
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          budget: true,
          spent: true,
          startDate: true,
          endDate: true,
          status: true,
          category: true,
          createdAt: true,
          brand: {
            select: {
              companyName: true,
              industry: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          campaignCreators: {
            select: {
              creator: {
                select: {
                  id: true,
                  displayName: true,
                  handle: true,
                  profileImageUrl: true,
                  socialAccounts: {
                    select: {
                      platform: true,
                      metrics: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              campaignCreators: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.campaign.count({ where }),
    ]);
    
    // Transform data for frontend
    const transformedCampaigns = campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description?.substring(0, 200) + (campaign.description?.length > 200 ? "..." : ""),
      budget: campaign.budget,
      spent: campaign.spent,
      remaining: campaign.budget - campaign.spent,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      category: campaign.category,
      createdAt: campaign.createdAt,
      brand: {
        companyName: campaign.brand.companyName,
        industry: campaign.brand.industry,
        contactName: campaign.brand.user.name,
      },
      creators: campaign.campaignCreators.map((cc) => ({
        id: cc.creator.id,
        displayName: cc.creator.displayName,
        handle: cc.creator.handle,
        profileImageUrl: cc.creator.profileImageUrl,
        platforms: cc.creator.socialAccounts.map((sa) => sa.platform),
      })),
      creatorCount: campaign._count.campaignCreators,
    }));
    
    return NextResponse.json({
      campaigns: transformedCampaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error("Discover API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
