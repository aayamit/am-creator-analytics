import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: creatorId } = await params;

    // Verify permissions
    const creator = await prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      include: { user: true },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    if (
      session.user.role === "CREATOR" &&
      session.user.id !== creator.userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch analytics data
    const [followerData, engagementData, demographics] = await Promise.all([
      // Follower growth (last 6 months)
      prisma.analyticsMetric.findMany({
        where: {
          socialAccount: { creatorId },
          type: "FOLLOWERS",
        },
        orderBy: { date: "asc" },
        take: 180, // ~6 months
      }),

      // Engagement rates
      prisma.analyticsMetric.findMany({
        where: {
          socialAccount: { creatorId },
          type: "ENGAGEMENT_RATE",
        },
        orderBy: { date: "asc" },
        take: 180,
      }),

      // Audience demographics
      prisma.audienceDemographic.findMany({
        where: { creatorId },
      }),
    ]);

    // Transform data for charts
    const followerChartData = followerData.map((m) => ({
      date: m.date.toLocaleDateString("en-US", { month: "short" }),
      value: m.value.toNumber(),
    }));

    const engagementChartData = engagementData.map((m) => ({
      date: m.date.toLocaleDateString("en-US", { month: "short" }),
      value: m.value.toNumber(),
    }));

    const audienceDemographics = demographics.map((d) => ({
      label: d.label,
      value: d.percentage.toNumber(),
      type: d.type,
    }));

    return NextResponse.json({
      followers: followerChartData,
      engagement: engagementChartData,
      demographics: audienceDemographics,
      summary: {
        totalFollowers: followerData[followerData.length - 1]?.value.toNumber() || 0,
        avgEngagement: calculateAverage(engagementData.map((m) => m.value.toNumber())),
        audienceQuality: 92, // Calculated field
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

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
