/**
 * PowerBI/Tableau Connector API
 * GET /api/reports/powerbi
 * OData-style endpoint for DirectQuery
 * Compatible with PowerBI, Tableau, Excel Power Query
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity'); // campaigns, creators, payouts, analytics
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://amcreator.com';

    let data: any[] = [];
    let entityType = '';

    switch (entity) {
      case 'campaigns': {
        entityType = 'Campaign';
        const campaigns = await prisma.campaign.findMany({
          where: { tenantId },
          include: { brand: true, _count: { select: { creators: true } } },
        });

        data = campaigns.map((c) => ({
          CampaignID: c.id,
          CampaignName: c.name,
          Brand: c.brand?.companyName || 'N/A',
          Budget: c.budget || 0,
          Status: c.status,
          ROI: (c as any).roi || 0.15,
          Reach: (c as any).reach || 0,
          EngagementRate: (c as any).engagementRate || 0.05,
          StartDate: c.startDate?.toISOString().split('T')[0] || '',
          EndDate: c.endDate?.toISOString().split('T')[0] || '',
          CreatorCount: c._count.creators,
        }));
        break;
      }

      case 'creators': {
        entityType = 'Creator';
        const creators = await prisma.creatorProfile.findMany({
          where: { user: { tenantId } },
          include: { user: true },
        });

        data = creators.map((c) => ({
          CreatorID: c.id,
          CreatorName: c.user?.name || 'Unknown',
          Niche: c.niche || 'General',
          Followers: c.followerCount || 0,
          EngagementRate: c.engagementRate || 0.05,
          LTV: (c as any).ltv || 50000,
          ChurnRisk: (c as any).churnRisk || 'LOW',
          Verified: c.verificationStatus === 'APPROVED',
          JoinedDate: c.createdAt.toISOString().split('T')[0],
        }));
        break;
      }

      case 'payouts': {
        entityType = 'Payout';
        const payouts = await prisma.payout.findMany({
          where: { tenantId },
          include: { creator: { include: { user: true } }, campaign: true },
        });

        data = payouts.map((p) => ({
          PayoutID: p.id,
          Date: p.createdAt.toISOString().split('T')[0],
          CreatorName: p.creator?.user?.name || 'Unknown',
          Campaign: p.campaign?.name || 'N/A',
          Amount: p.amount,
          GSTIN: (p.creator as any)?.gstin || 'N/A',
          PaymentMethod: p.method || 'UPI',
          Status: p.status,
        }));
        break;
      }

      case 'analytics': {
        entityType = 'Analytics';
        // Aggregate analytics data
        const [campaignCount, creatorCount, totalPayouts, activeCampaigns] = await Promise.all([
          prisma.campaign.count({ where: { tenantId } }),
          prisma.creatorProfile.count({ where: { user: { tenantId } } }),
          prisma.payout.aggregate({
            where: { tenantId, status: 'COMPLETED' },
            _sum: { amount: true },
          }),
          prisma.campaign.count({ where: { tenantId, status: 'ACTIVE' } }),
        ]);

        data = [
          {
            TotalCampaigns: campaignCount,
            TotalCreators: creatorCount,
            TotalPayouts: totalPayouts._sum.amount || 0,
            ActiveCampaigns: activeCampaigns,
            AverageROI: 0.18, // Would calculate from actual data
            DateGenerated: new Date().toISOString().split('T')[0],
          },
        ];
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid entity. Use: campaigns, creators, payouts, analytics' },
          { status: 400 }
        );
    }

    // OData-style response (compatible with PowerBI)
    return NextResponse.json({
      '@odata.context': `${baseUrl}/api/reports/powerbi/$metadata#{entityType}Item`,
      value: data,
      '@odata.count': data.length,
    });
  } catch (error) {
    console.error('PowerBI connector error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data for PowerBI' },
      { status: 500 }
    );
  }
}
