/**
 * PDF Export Utility
 * Generate branded PDF reports using jspdf + jspdf-autotable
 * Bloomberg × McKinsey design aesthetics
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { prisma } from './prisma';

interface ReportData {
  title: string;
  subtitle?: string;
  tenantId: string;
  generatedBy: string;
  period: {
    start: Date;
    end: Date;
  };
  sections: ReportSection[];
}

interface ReportSection {
  title: string;
  type: 'table' | 'kpi' | 'text';
  data?: any[];
  kpis?: Array<{ label: string; value: string; change?: string }>;
  text?: string;
}

// Bloomberg × McKinsey color scheme
const COLORS = {
  background: '#F8F7F4',
  primary: '#1a1a2e',
  accent: '#92400e',
  secondary: '#6b7280',
  success: '#16a34a',
  border: 'rgba(26,26,46,0.1)',
};

export async function generatePDFReport(data: ReportData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set background
  doc.setFillColor(COLORS.background);
  doc.rect(0, 0, 210, 297, 'F');

  // Header
  let yPosition = 20;
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary);
  doc.text(data.title, 20, yPosition);
  yPosition += 10;

  // Subtitle
  if (data.subtitle) {
    doc.setFontSize(14);
    doc.setTextColor(COLORS.accent);
    doc.text(data.subtitle, 20, yPosition);
    yPosition += 8;
  }

  // Meta info
  doc.setFontSize(10);
  doc.setTextColor(COLORS.secondary);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | By: ${data.generatedBy}`, 20, yPosition);
  yPosition += 6;
  doc.text(
    `Period: ${data.period.start.toLocaleDateString()} - ${data.period.end.toLocaleDateString()}`,
    20,
    yPosition
  );
  yPosition += 15;

  // Divider
  doc.setDrawColor(COLORS.border);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 15;

  // Sections
  for (const section of data.sections) {
    // Section title
    doc.setFontSize(16);
    doc.setTextColor(COLORS.primary);
    doc.text(section.title, 20, yPosition);
    yPosition += 10;

    if (section.type === 'kpi' && section.kpis) {
      // KPI cards (simplified text version)
      section.kpis.forEach((kpi) => {
        doc.setFontSize(12);
        doc.setTextColor(COLORS.secondary);
        doc.text(kpi.label, 25, yPosition);
        doc.setFontSize(14);
        doc.setTextColor(COLORS.primary);
        doc.text(kpi.value, 25, yPosition + 6);
        if (kpi.change) {
          doc.setFontSize(10);
          doc.setTextColor(kpi.change.startsWith('+') ? COLORS.success : '#dc2626');
          doc.text(kpi.change, 25, yPosition + 12);
        }
        yPosition += 20;
      });
    } else if (section.type === 'table' && section.data) {
      // Table
      const headers = Object.keys(section.data[0] || {});
      const rows = section.data.map((row) => Object.values(row));

      (doc as any).autoTable({
        startY: yPosition,
        head: [headers],
        body: rows,
        theme: 'grid',
        headStyles: {
          fillColor: COLORS.primary,
          textColor: '#ffffff',
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
          textColor: COLORS.primary,
        },
        margin: { left: 20, right: 20 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    } else if (section.type === 'text' && section.text) {
      doc.setFontSize(11);
      doc.setTextColor(COLORS.primary);
      const lines = doc.splitTextToSize(section.text, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 10;
    }

    // Check page break
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
      doc.setFillColor(COLORS.background);
      doc.rect(0, 0, 210, 297, 'F');
    }
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.secondary);
    doc.text(
      `AM Creator Analytics — Confidential Report`,
      20,
      285
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      170,
      285
    );
  }

  // Return as buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

// Helper: Generate Campaign Performance Report
export async function generateCampaignReport(
  tenantId: string,
  campaignId: string
): Promise<Buffer> {
  // Fetch campaign data
  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, tenantId },
    include: {
      creators: {
        include: { creator: true },
      },
    },
  });

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  const data: ReportData = {
    title: `Campaign Report: ${campaign.name}`,
    subtitle: `Status: ${campaign.status}`,
    tenantId,
    generatedBy: 'System',
    period: {
      start: campaign.startDate || new Date(),
      end: campaign.endDate || new Date(),
    },
    sections: [
      {
        title: 'Key Performance Indicators',
        type: 'kpi',
        kpis: [
          { label: 'Total Budget', value: `₹${campaign.budget?.toLocaleString() || 0}` },
          { label: 'Creators', value: campaign.creators.length.toString() },
          { label: 'Status', value: campaign.status },
        ],
      },
      {
        title: 'Creator Details',
        type: 'table',
        data: campaign.creators.map((cc) => ({
          Name: cc.creator.user.name || 'Unknown',
          Platform: cc.creator.platform,
          Followers: cc.creator.followerCount?.toLocaleString() || '0',
          Rate: `${cc.rate || 0}%`,
        })),
      },
    ],
  };

  return generatePDFReport(data);
}

// Helper: Generate Earnings Summary
export async function generateEarningsReport(
  tenantId: string,
  userId: string
): Promise<Buffer> {
  // Fetch creator profile and contracts
  const profile = await prisma.creatorProfile.findFirst({
    where: { userId },
    include: { user: true },
  });

  const contracts = await prisma.contract.findMany({
    where: {
      campaignCreator: {
        creator: { userId },
      },
      status: 'SIGNED',
    },
    include: {
      campaignCreator: {
        include: { campaign: true },
      },
    },
  });

  const totalEarnings = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);

  const data: ReportData = {
    title: `Earnings Report: ${profile?.user.name || 'Creator'}`,
    tenantId,
    generatedBy: 'System',
    period: {
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date(),
    },
    sections: [
      {
        title: 'Earnings Summary',
        type: 'kpi',
        kpis: [
          { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}` },
          { label: 'Contracts Signed', value: contracts.length.toString() },
          {
            label: 'Average per Contract',
            value: `₹${contracts.length > 0 ? Math.round(totalEarnings / contracts.length).toLocaleString() : 0}`,
          },
        ],
      },
      {
        title: 'Contract History',
        type: 'table',
        data: contracts.map((c) => ({
          Campaign: c.campaignCreator.campaign.name,
          Amount: `₹${c.amount?.toLocaleString() || 0}`,
          Signed: c.signedAt?.toLocaleDateString() || 'N/A',
          Status: c.status,
        })),
      },
    ],
  };

  return generatePDFReport(data);
}
