/**
 * ROI Analytics API (Brand)
 * GET /api/brands/analytics/roi
 * Returns ROI data for all brand campaigns
 * With rate limiting (60 req/min)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";
import { withRateLimit, apiLimiter } from "@/lib/with-rate-limit";

interface ROIResult {
  campaignId: string;
  campaignTitle: string;
  status: string;
  budget: number;
  spent: number;
  remaining: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  metrics: {
    ctr: number;
    conversionRate: number;
    cpm: number;
    cpc: number;
    cpa: number;
    roas: number;
    roi: number;
  };
  creatorPerformance: Array<{
    creatorId: string;
    creatorName: string;
    impressions: number;
    clicks: number;
    rate: number;
    efficiency: number;
  }>;
}

export const GET = withRateLimit(apiLimiter, async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    // Get all campaigns with tracking events
    const campaigns = await prisma.campaign.findMany({
      where: { brandId: brandProfile.id },
      include: {
        trackingEvents: true,
        campaignCreators: {
          include: {
            creator: true,
            deliverables: true,
            contract: true,
          },
        },
      },
    });

    // Calculate ROI metrics per campaign
    const roiData: ROIResult[] = campaigns.map((campaign) => {
      // Aggregate tracking events
      const impressions = campaign.trackingEvents
        .filter((e) => e.eventType === "IMPRESSION")
        .reduce((sum, e) => sum + (e.count || 0), 0);

      const clicks = campaign.trackingEvents
        .filter((e) => e.eventType === "CLICK")
        .reduce((sum, e) => sum + (e.count || 0), 0);

      const conversions = campaign.trackingEvents
        .filter((e) => e.eventType === "CONVERSION")
        .reduce((sum, e) => sum + (e.count || 0), 0);

      const revenue = campaign.trackingEvents
        .filter((e) => e.eventType === "CONVERSION")
        .reduce((sum, e) => sum + (e.revenue || 0), 0);

      // Calculate metrics
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      const cpm =
        impressions > 0 ? (campaign.spent / impressions) * 1000 : 0;
      const cpc = clicks > 0 ? campaign.spent / clicks : 0;
      const cpa = conversions > 0 ? campaign.spent / conversions : 0;
      const roas = campaign.spent > 0 ? revenue / campaign.spent : 0;
      const roi = campaign.spent > 0
        ? ((revenue - campaign.spent) / campaign.spent) * 100
        : 0;

      // Creator performance
      const creatorPerformance = campaign.campaignCreators.map((cc) => {
        const creatorImpressions = campaign.trackingEvents
          .filter(
            (e) => e.eventType === "IMPRESSION" && e.creatorId === cc.creatorId
          )
          .reduce((sum, e) => sum + (e.count || 0), 0);

        const creatorClicks = campaign.trackingEvents
          .filter(
            (e) => e.eventType === "CLICK" && e.creatorId === cc.creatorId
          )
          .reduce((sum, e) => sum + (e.count || 0), 0);

        return {
          creatorId: cc.creator.id,
          creatorName: cc.creator.displayName,
          impressions: creatorImpressions,
          clicks: creatorClicks,
          rate: cc.rate,
          efficiency: cc.rate > 0 ? creatorClicks / cc.rate : 0,
        };
      });

      return {
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        status: campaign.status,
        budget: campaign.budget,
        spent: campaign.spent,
        remaining: campaign.budget - campaign.spent,
        impressions,
        clicks,
        conversions,
        revenue,
        metrics: {
          ctr: parseFloat(ctr.toFixed(2)),
          conversionRate: parseFloat(conversionRate.toFixed(2)),
          cpm: parseFloat(cpm.toFixed(2)),
          cpc: parseFloat(cpc.toFixed(2)),
          cpa: parseFloat(cpa.toFixed(2)),
          roas: parseFloat(roas.toFixed(2)),
          roi: parseFloat(roi.toFixed(2)),
        },
        creatorPerformance,
      };
    });

    // Summary
    const summary = {
      totalCampaigns: campaigns.length,
      totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
      totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
      totalRevenue: roiData.reduce((sum, c) => sum + c.revenue, 0),
      averageRoas:
        roiData.length > 0
          ? roiData.reduce((sum, c) => sum + c.metrics.roas, 0) / roiData.length
          : 0,
      averageRoi:
        roiData.length > 0
          ? roiData.reduce((sum, c) => sum + c.metrics.roi, 0) / roiData.length
          : 0,
    };

    return NextResponse.json({ roiData, summary });
  } catch (error) {
    console.error("ROI analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ROI data" },
      { status: 500 }
    );
  }
});
