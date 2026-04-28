import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const niche = searchParams.get("niche");
    const platform = searchParams.get("platform");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      user: {
        role: "CREATOR",
      },
    };

    if (niche) {
      where.niche = niche;
    }

    if (platform) {
      where.socialAccounts = {
        some: {
          platform: platform,
        },
      };
    }

    // Fetch creators with related data
    const [creators, total] = await Promise.all([
      prisma.creatorProfile.findMany({
        where,
        include: {
          user: true,
          socialAccounts: {
            include: {
              metrics: {
                orderBy: { date: "desc" },
                take: 1,
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.creatorProfile.count({ where }),
    ]);

    // Transform data for frontend
    const transformedCreators = creators.map((creator) => {
      const primaryAccount = creator.socialAccounts[0];
      const latestMetric = primaryAccount?.metrics[0];

      return {
        id: creator.id,
        name: creator.displayName,
        niche: creator.niche,
        platform: primaryAccount?.platform || "N/A",
        followers: primaryAccount
          ? formatNumber(primaryAccount.metrics[0]?.value?.toNumber() || 0)
          : "0",
        engagement: "5.8%", // Calculate from metrics
        audienceQuality: 92, // Calculate from audienceDemographics
        avgViews: "48K", // Calculate from metrics
        pricing: creator.pricing && typeof creator.pricing === 'object' && 'cpm' in creator.pricing
          ? `$${creator.pricing.cpm || 2400}`
          : "$2,400",
        image: null,
      };
    });

    return NextResponse.json({
      creators: transformedCreators,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
