import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/brands/analytics/campaigns/[id]
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get brand profile
    const brand = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    const campaignId = params.id;

    // Get campaign with all related data
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        brandId: brand.id,
      },
      include: {
        campaignCreators: {
          include: {
            creator: {
              include: {
                socialAccounts: true,
              },
            },
            payoutTransactions: true,
          },
        },
        leads: true,
        trackingEvents: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Calculate campaign metrics
    const budget = Number(campaign.budget);
    const spent = Number(campaign.spent);
    const remaining = budget - spent;
    const burnRate = budget > 0 ? (spent / budget) * 100 : 0;

    // Aggregate performance from all creators in campaign
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalReach = 0;

    const creatorMetrics = campaign.campaignCreators.map((cc) => {
      const perf = cc.performance || {};
      const impressions = perf.impressions || 0;
      const clicks = perf.clicks || 0;
      const reach = perf.reach || 0;

      totalImpressions += impressions;
      totalClicks += clicks;
      totalReach += reach;

      return {
        creatorId: cc.creatorId,
        creatorName: cc.creator.name || "Unknown",
        creatorHandle: cc.creator.handle || "",
        platform: cc.creator.socialAccounts[0]?.platform || "unknown",
        impressions,
        clicks,
        reach,
        ctr: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00",
        rate: Number(cc.rate),
        paymentStatus: cc.paymentStatus,
        deliverables: cc.deliverables,
      };
    });

    // Conversion data from leads
    const conversions = campaign.leads.filter(
      (l) => l.conversionStatus === "CONVERTED"
    ).length;
    const conversionRate =
      totalClicks > 0 ? ((conversions / totalClicks) * 100).toFixed(2) : "0.00";

    // Tracking events over time
    const trackingEventsByDay = campaign.trackingEvents.reduce((acc, event) => {
      const date = new Date(event.timestamp).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { impressions: 0, clicks: 0, conversions: 0 };
      }
      if (event.eventType === "IMPRESSION") acc[date].impressions++;
      if (event.eventType === "CLICK") acc[date].clicks++;
      if (event.eventType === "CONVERSION") acc[date].conversions++;
      return acc;
    }, {});

    const timeSeriesData = Object.entries(trackingEventsByDay).map(
      ([date, data]) => ({
        date,
        ...data,
      })
    );

    // ROI Calculation
    const estimatedRevenue = conversions * 100; // $100 per conversion estimate
    const roas = spent > 0 ? (estimatedRevenue / spent).toFixed(2) : "0.00";

    // Budget utilization
    const budgetUtilization = {
      spent,
      remaining,
      burnRate: burnRate.toFixed(2),
      dailyAverage: calculateDailyAverage(spent, campaign.startDate, campaign.endDate),
    };

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        status: campaign.status,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        budget,
        spent,
      },
      metrics: {
        totalImpressions,
        totalClicks,
        totalReach,
        conversions,
        ctr: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00",
        conversionRate,
        cpm: totalImpressions > 0 ? ((spent / totalImpressions) * 1000).toFixed(2) : "0.00",
        cpc: totalClicks > 0 ? (spent / totalClicks).toFixed(2) : "0.00",
        cpa: conversions > 0 ? (spent / conversions).toFixed(2) : "0.00",
        roas,
        estimatedRevenue,
      },
      creatorMetrics,
      timeSeriesData,
      budgetUtilization,
    });
  } catch (error) {
    console.error("Campaign analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign analytics" },
      { status: 500 }
    );
  }
}

function calculateDailyAverage(spent, startDate, endDate) {
  const days =
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
    (1000 * 60 * 60 * 24);
  return days > 0 ? spent / days : 0;
}
