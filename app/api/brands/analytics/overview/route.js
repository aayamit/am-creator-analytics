import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/brands/analytics/overview
export async function GET(request) {
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

    // Get all campaigns for this brand
    const campaigns = await prisma.campaign.findMany({
      where: { brandId: brand.id },
      include: {
        campaignCreators: {
          include: {
            creator: {
              include: {
                socialAccounts: true,
              },
            },
          },
        },
        leads: true,
        trackingEvents: true,
      },
    });

    // Calculate overview metrics
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
    const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0);
    const remainingBudget = totalBudget - totalSpent;

    // Aggregate performance metrics from campaignCreators
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;

    campaigns.forEach((campaign) => {
      campaign.campaignCreators.forEach((cc) => {
        if (cc.performance) {
          const perf = cc.performance;
          totalImpressions += perf.impressions || 0;
          totalClicks += perf.clicks || 0;
        }
      });
      // Count conversions from leads
      totalConversions += campaign.leads.filter(
        (l) => l.conversionStatus === "CONVERTED"
      ).length;
    });

    // Calculate rates
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const cpm = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0;
    const cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
    const cpa = totalConversions > 0 ? totalSpent / totalConversions : 0;

    // ROI Calculation (ROAS - Return on Ad Spend)
    const estimatedRevenue = totalConversions * 100; // Assume $100 per conversion
    const roas = totalSpent > 0 ? estimatedRevenue / totalSpent : 0;

    // Campaign performance over time (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const dailySpend = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        SUM(amount)::numeric as spend
      FROM "PayoutTransaction"
      WHERE "brandId" = ${brand.id}
        AND "createdAt" >= ${last30Days}
        AND status = 'PAID'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Spend by campaign
    const spendByCampaign = campaigns.map((c) => ({
      id: c.id,
      title: c.title,
      budget: Number(c.budget),
      spent: Number(c.spent),
      percentage: c.budget > 0 ? (Number(c.spent) / Number(c.budget)) * 100 : 0,
    }));

    // Top performing creators
    const creatorPerformance = campaigns.flatMap((c) =>
      c.campaignCreators.map((cc) => ({
        creatorId: cc.creatorId,
        creatorName: cc.creator.name || "Unknown",
        impressions: cc.performance?.impressions || 0,
        clicks: cc.performance?.clicks || 0,
        rate: Number(cc.rate),
      }))
    );

    const topCreators = creatorPerformance
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    return NextResponse.json({
      overview: {
        totalCampaigns,
        activeCampaigns,
        totalBudget,
        totalSpent,
        remainingBudget,
        totalImpressions,
        totalClicks,
        totalConversions,
        ctr: Number(ctr.toFixed(2)),
        conversionRate: Number(conversionRate.toFixed(2)),
        cpm: Number(cpm.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
        cpa: Number(cpa.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        estimatedRevenue,
      },
      dailySpend: dailySpend.map((d) => ({
        date: d.date,
        spend: Number(d.spend),
      })),
      spendByCampaign,
      topCreators,
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
