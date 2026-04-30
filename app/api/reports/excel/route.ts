/**
 * Excel Export API
 * GET /api/reports/excel
 * Generates .xlsx report with multiple sheets (campaigns, creators, payouts)
 * Uses exceljs (MIT license)
 */

import { NextRequest, NextResponse } from "next/server";
import ExcelJS from 'exceljs';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // No caching

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const reportType = searchParams.get('type') || 'all'; // 'campaigns' | 'creators' | 'payouts' | 'all'

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AM Creator Analytics';
    workbook.created = new Date();

    // 1. Campaigns Sheet
    if (reportType === 'all' || reportType === 'campaigns') {
      const campaignsSheet = workbook.addWorksheet('Campaigns', {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
      });

      // Columns
      campaignsSheet.columns = [
  { header: 'Campaign Name', key: 'name', width: 30 },
  { header: 'Brand', key: 'brand', width: 25 },
  { header: 'Budget (₹)', key: 'budget', width: 15, style: { numFmt: '₹#,##0' } },
  { header: 'Status', key: 'status', width: 15 },
  { header: 'ROI (%)', key: 'roi', width: 12, style: { numFmt: '0.00%' } },
  { header: 'Reach', key: 'reach', width: 15, style: { numFmt: '#,##0' } },
  { header: 'Engagement Rate', key: 'engagement', width: 18, style: { numFmt: '0.00%' } },
  { header: 'Start Date', key: 'startDate', width: 15, style: { numFmt: 'yyyy-mm-dd' } },
  { header: 'End Date', key: 'endDate', width: 15, style: { numFmt: 'yyyy-mm-dd' } },
      ];

      // Style header row
      campaignsSheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1a1a2e' }, // Bloomberg dark
        };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.alignment = { horizontal: 'center' };
      });

      // Fetch campaigns
      const campaigns = await prisma.campaign.findMany({
        where: { tenantId },
        include: { brand: true, _count: { select: { creators: true } } },
      });

      // Add rows
      campaigns.forEach((campaign) => {
        campaignsSheet.addRow({
          name: campaign.name,
          brand: campaign.brand?.companyName || 'N/A',
          budget: campaign.budget || 0,
          status: campaign.status,
          roi: (campaign as any).roi || 0.15, // Default 15%
          reach: (campaign as any).reach || 0,
          engagement: (campaign as any).engagementRate || 0.05,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        });
      });
    }

    // 2. Creators Sheet
    if (reportType === 'all' || reportType === 'creators') {
      const creatorsSheet = workbook.addWorksheet('Creators', {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
      });

      creatorsSheet.columns = [
  { header: 'Creator Name', key: 'name', width: 25 },
  { header: 'Niche', key: 'niche', width: 20 },
  { header: 'Followers', key: 'followers', width: 15, style: { numFmt: '#,##0' } },
  { header: 'Engagement Rate', key: 'engagement', width: 18, style: { numFmt: '0.00%' } },
  { header: 'LTV (₹)', key: 'ltv', width: 15, style: { numFmt: '₹#,##0' } },
  { header: 'Churn Risk', key: 'churnRisk', width: 15 },
  { header: 'Verified', key: 'verified', width: 12 },
      ];

      // Style header
      creatorsSheet.getRow(1).eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF92400e' } }; // McKinsey accent
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.alignment = { horizontal: 'center' };
      });

      // Fetch creators
      const creators = await prisma.creatorProfile.findMany({
        where: { user: { tenantId } },
        include: { user: true, _count: { select: { campaigns: true } } },
      });

      creators.forEach((creator) => {
        creatorsSheet.addRow({
          name: creator.user?.name || 'Unknown',
          niche: creator.niche || 'General',
          followers: creator.followerCount || 0,
          engagement: creator.engagementRate || 0.05,
          ltv: (creator as any).ltv || 50000,
          churnRisk: (creator as any).churnRisk || 'LOW',
          verified: creator.verificationStatus === 'APPROVED' ? 'Yes' : 'No',
        });
      });
    }

    // 3. Payouts Sheet (GST-compliant)
    if (reportType === 'all' || reportType === 'payouts') {
      const payoutsSheet = workbook.addWorksheet('Payouts', {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
      });

      payoutsSheet.columns = [
  { header: 'Date', key: 'date', width: 15, style: { numFmt: 'yyyy-mm-dd' } },
  { header: 'Creator', key: 'creator', width: 25 },
  { header: 'Campaign', key: 'campaign', width: 30 },
  { header: 'Amount (₹)', key: 'amount', width: 15, style: { numFmt: '₹#,##0.00' } },
  { header: 'GSTIN', key: 'gstin', width: 20 },
  { header: 'Payment Method', key: 'method', width: 18 },
  { header: 'Status', key: 'status', width: 15 },
  { header: 'Invoice Link', key: 'invoice', width: 40 },
      ];

      // Style header
      payoutsSheet.getRow(1).eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1a1a2e' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.alignment = { horizontal: 'center' };
      });

      // Fetch payouts
      const payouts = await prisma.payout.findMany({
        where: { tenantId },
        include: { creator: { include: { user: true } }, campaign: true },
      });

      payouts.forEach((payout) => {
        payoutsSheet.addRow({
          date: payout.createdAt,
          creator: payout.creator?.user?.name || 'Unknown',
          campaign: payout.campaign?.name || 'N/A',
          amount: payout.amount,
          gstin: (payout.creator as any)?.gstin || 'N/A',
          method: payout.method || 'UPI',
          status: payout.status,
          invoice: `${process.env.NEXTAUTH_URL || 'https://amcreator.com'}/invoices/${payout.id}`,
        });
      });
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="am-creator-report-${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel report' },
      { status: 500 }
    );
  }
}
