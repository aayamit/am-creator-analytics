/**
 * CSV Export API
 * GET /api/reports/csv
 * Generates .csv report (single-click download)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const reportType = searchParams.get('type') || 'campaigns'; // campaigns | creators | payouts

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    let csvRows: string[] = [];
    let filename = '';

    switch (reportType) {
      case 'campaigns': {
        const campaigns = await prisma.campaign.findMany({
          where: { tenantId },
          include: { brand: true },
        });

        // Header
        csvRows.push('Campaign Name,Brand,Budget,Status,ROI,Reach,Engagement Rate,Start Date,End Date');

        // Data rows
        campaigns.forEach((c) => {
          csvRows.push([
            `"${c.name}"`,
            `"${c.brand?.companyName || 'N/A'}"`,
            c.budget || 0,
            c.status,
            (c as any).roi || 0.15,
            (c as any).reach || 0,
            (c as any).engagementRate || 0.05,
            c.startDate?.toISOString().split('T')[0] || '',
            c.endDate?.toISOString().split('T')[0] || '',
          ].join(','));
        });

        filename = 'campaigns.csv';
        break;
      }

      case 'creators': {
        const creators = await prisma.creatorProfile.findMany({
          where: { user: { tenantId } },
          include: { user: true },
        });

        csvRows.push('Creator Name,Niche,Followers,Engagement Rate,LTV,Churn Risk,Verified');

        creators.forEach((c) => {
          csvRows.push([
            `"${c.user?.name || 'Unknown'}"`,
            c.niche || 'General',
            c.followerCount || 0,
            c.engagementRate || 0.05,
            (c as any).ltv || 50000,
            (c as any).churnRisk || 'LOW',
            c.verificationStatus === 'APPROVED' ? 'Yes' : 'No',
          ].join(','));
        });

        filename = 'creators.csv';
        break;
      }

      case 'payouts': {
        const payouts = await prisma.payout.findMany({
          where: { tenantId },
          include: { creator: { include: { user: true } }, campaign: true },
        });

        csvRows.push('Date,Creator,Campaign,Amount,GSTIN,Payment Method,Status,Invoice Link');

        payouts.forEach((p) => {
          csvRows.push([
            p.createdAt.toISOString().split('T')[0],
            `"${p.creator?.user?.name || 'Unknown'}"`,
            `"${p.campaign?.name || 'N/A'}"`,
            p.amount,
            (p.creator as any)?.gstin || 'N/A',
            p.method || 'UPI',
            p.status,
            `${process.env.NEXTAUTH_URL || 'https://amcreator.com'}/invoices/${p.id}`,
          ].join(','));
        });

        filename = 'payouts.csv';
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV report' },
      { status: 500 }
    );
  }
}
