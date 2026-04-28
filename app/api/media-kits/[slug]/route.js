import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/media-kits/[slug] - Public media kit view
export async function GET(request, { params }) {
  try {
    const { slug } = params;

    // Find media kit by slug
    const mediaKit = await prisma.mediaKit.findUnique({
      where: { slug },
      include: {
        creator: {
          include: {
            socialAccounts: true,
            audienceDemographics: true,
            campaigns: {
              where: { status: "COMPLETED" },
              include: {
                campaign: true,
                creator: true,
              },
              orderBy: { createdAt: "desc" },
              take: 10,
            },
          },
        },
      },
    });

    if (!mediaKit) {
      return NextResponse.json({ error: "Media kit not found" }, { status: 404 });
    }

    // Check if public or if user is the owner (we'll check auth optionally)
    if (!mediaKit.isPublic) {
      // For now, return 403 if not public
      // In production, you'd check if the requester is the owner
      return NextResponse.json({ error: "Media kit is private" }, { status: 403 });
    }

    const creator = mediaKit.creator;

    // Aggregate live metrics from social accounts
    const socialMetrics = creator.socialAccounts.reduce(
      (acc, account) => {
        acc.totalFollowers += account.followers || 0;
        acc.totalFollowing += account.following || 0;
        acc.accounts.push({
          platform: account.platform,
          username: account.username,
          followers: account.followers,
          following: account.following,
          engagementRate: account.engagementRate,
          lastSync: account.lastSync,
        });
        return acc;
      },
      { totalFollowers: 0, totalFollowing: 0, accounts: [] }
    );

    // Get recent analytics metrics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMetrics = await prisma.analyticsMetric.findMany({
      where: {
        socialAccountId: {
          in: creator.socialAccounts.map((a) => a.id),
        },
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { date: "asc" },
    });

    // Aggregate metrics by type
    const metricsSummary = recentMetrics.reduce(
      (acc, metric) => {
        if (!acc[metric.type]) {
          acc[metric.type] = { total: 0, count: 0 };
        }
        acc[metric.type].total += Number(metric.value);
        acc[metric.type].count += 1;
        return acc;
      },
      {}
    );

    // Format audience demographics
    const demographics = creator.audienceDemographics.reduce(
      (acc, demo) => {
        const key = demo.type.toLowerCase();
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          label: demo.label,
          percentage: Number(demo.percentage),
        });
        return acc;
      },
      {}
    );

    // Past campaigns summary
    const pastCampaigns = creator.campaigns.map((cc) => ({
      campaignTitle: cc.campaign.title,
      brandName: cc.campaign.brand.name || "Anonymous",
      deliverables: cc.deliverables,
      performance: cc.performance,
      completedAt: cc.createdAt,
    }));

    // Calculate overall stats
    const totalImpressions = (metricsSummary.IMPRESSION?.total || 0);
    const totalEngagement = (metricsSummary.LIKE?.total || 0) + 
                          (metricsSummary.COMMENT?.total || 0) + 
                          (metricsSummary.SHARE?.total || 0);
    const avgEngagementRate = socialMetrics.accounts.length > 0
      ? socialMetrics.accounts.reduce((sum, a) => sum + (a.engagementRate || 0), 0) / socialMetrics.accounts.length
      : 0;

    return NextResponse.json({
      mediaKit: {
        slug: mediaKit.slug,
        isPublic: mediaKit.isPublic,
        settings: mediaKit.settings,
        updatedAt: mediaKit.updatedAt,
      },
      creator: {
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        bio: creator.bio,
        niche: creator.niche,
        location: creator.location,
        website: creator.website,
        rateRange: creator.rateRange,
      },
      liveMetrics: {
        totalFollowers: socialMetrics.totalFollowers,
        totalFollowing: socialMetrics.totalFollowing,
        avgEngagementRate: avgEngagementRate.toFixed(2),
        totalImpressions,
        totalEngagement,
        platforms: socialMetrics.accounts,
      },
      analytics: {
        last30Days: recentMetrics.map((m) => ({
          date: m.date,
          type: m.type,
          value: Number(m.value),
        })),
        summary: metricsSummary,
      },
      audienceDemographics: demographics,
      pastCampaigns: mediaKit.settings?.showPastCampaigns ? pastCampaigns : [],
    });
  } catch (error) {
    console.error("Public media kit error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media kit" },
      { status: 500 }
    );
  }
}
