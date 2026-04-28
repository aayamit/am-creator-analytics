import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/analytics/export - Export analytics as CSV or PDF
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv"; // csv or pdf
    const type = searchParams.get("type") || "overview"; // overview, campaigns, creators
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Verify brand role
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // Fetch campaigns
    const campaigns = await prisma.campaign.findMany({
      where: {
        brandId: brandProfile.id,
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
      },
      include: {
        campaignCreators: {
          include: {
            creator: true,
            deliverables: true,
            contract: true,
          },
        },
        trackingEvents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (format === "csv") {
      return exportCSV(campaigns, type);
    } else if (format === "pdf") {
      return exportPDF(campaigns, type, brandProfile.companyName);
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

function exportCSV(campaigns, type) {
  let csv = "";

  if (type === "overview" || type === "campaigns") {
    // CSV header
    csv = "Campaign ID,Title,Status,Budget,Spent,Start Date,End Date,Creators,Impressions,Clicks,Conversions\n";

    campaigns.forEach((campaign) => {
      const impressions = campaign.trackingEvents
        .filter((e) => e.eventType === "IMPRESSION")
        .reduce((sum, e) => sum + (e.count || 0), 0);
      const clicks = campaign.trackingEvents
        .filter((e) => e.eventType === "CLICK")
        .reduce((sum, e) => sum + (e.count || 0), 0);
      const conversions = campaign.trackingEvents
        .filter((e) => e.eventType === "CONVERSION")
        .reduce((sum, e) => sum + (e.count || 0), 0);

      csv += `${campaign.id},"${campaign.title}",${campaign.status},${campaign.budget},${campaign.spent},${campaign.startDate},${campaign.endDate},${campaign.campaignCreators.length},${impressions},${clicks},${conversions}\n`;
    });
  } else if (type === "creators") {
    csv = "Creator ID,Name,Handle,Email,Campaigns,Total Rate,Impressions,Clicks\n";

    const creatorMap = new Map();
    campaigns.forEach((campaign) => {
      campaign.campaignCreators.forEach((cc) => {
        const existing = creatorMap.get(cc.creatorId) || {
          creator: cc.creator,
          campaigns: 0,
          totalRate: 0,
          impressions: 0,
          clicks: 0,
        };
        existing.campaigns += 1;
        existing.totalRate += cc.rate || 0;
        creatorMap.set(cc.creatorId, existing);
      });
    });

    creatorMap.forEach((data, creatorId) => {
      csv += `${creatorId},"${data.creator.displayName}","${data.creator.handle}","${data.creator.user.email}",${data.campaigns},${data.totalRate},${data.impressions},${data.clicks}\n`;
    });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="analytics_${type}_${Date.now()}.csv"`,
    },
  });
}

async function exportPDF(campaigns, type, companyName) {
  // Dynamic import for jspdf (client-side only library)
  const { jsPDF } = require("jspdf");
  const autoTable = require("jspdf-autotable");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(58, 57, 65); // #3A3941
  doc.text(`${companyName} - Analytics Report`, pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    28,
    { align: "center" }
  );

  // Summary
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);

  doc.setFontSize(12);
  doc.setTextColor(58, 57, 65);
  doc.text(`Total Campaigns: ${campaigns.length}`, 14, 40);
  doc.text(`Total Budget: $${totalBudget.toLocaleString()}`, 14, 48);
  doc.text(`Total Spent: $${totalSpent.toLocaleString()}`, 14, 56);

  // Table
  const tableData = campaigns.map((c) => [
    c.title,
    c.status,
    `$${c.budget.toLocaleString()}`,
    `$${c.spent.toLocaleString()}`,
    c.campaignCreators.length.toString(),
  ]);

  autoTable(doc, {
    head: [["Campaign", "Status", "Budget", "Spent", "Creators"]],
    body: tableData,
    startY: 65,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [193, 154, 91] }, // #C19A5B
    margin: { left: 14, right: 14 },
  });

  const pdfBuffer = doc.output("arraybuffer");

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="analytics_${type}_${Date.now()}.pdf"`,
    },
  });
}
