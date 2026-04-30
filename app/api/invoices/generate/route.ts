/**
 * GST Invoice Generation API
 * POST /api/invoices/generate
 * Generates GST-compliant PDF invoice
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGSTInvoice, GSTInvoice, InvoiceItem } from "@/lib/gst-invoice";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, creatorId } = body;

    if (!campaignId || !creatorId) {
      return NextResponse.json(
        { error: "campaignId and creatorId are required" },
        { status: 400 }
      );
    }

    // Fetch campaign with brand and creator details
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        brand: {
          include: { user: true },
        },
        creators: {
          where: { creatorId },
          include: { creator: { include: { user: true } } },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.creators.length === 0) {
      return NextResponse.json(
        { error: "Creator not found in this campaign" },
        { status: 404 }
      );
    }

    const creatorEntry = campaign.creators[0];
    const brand = campaign.brand;
    const creator = creatorEntry.creator;

    // Build invoice items
    const items: InvoiceItem[] = [
      {
        description: `Campaign: ${campaign.name}`,
        hsnCode: "9983", // SAC code for advertising services
        quantity: 1,
        rate: campaign.budget || 0,
        gstRate: 18, // 18% GST for advertising
      },
    ];

    // Determine if inter-state (simplified: check if brand and creator states differ)
    const brandState = brand.stateCode || "07"; // Default: Delhi
    const creatorState = creator.stateCode || "07";
    const isInterState = brandState !== creatorState;

    // Build GST Invoice
    const invoice: GSTInvoice = {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date(),
      placeOfSupply: brandState,

      supplierName: brand.companyName || brand.user.name || "AM Creator Analytics",
      supplierGstin: brand.gstin || "",
      supplierAddress: `${brand.address || ""}, ${brand.city || ""}, ${brandState}`,
      supplierStateCode: brandState,

      recipientName: creator.displayName || creator.user.name || "Creator",
      recipientGstin: creator.gstin || undefined,
      recipientAddress: `${creator.city || ""}, ${creatorState}`,
      recipientStateCode: creatorState,

      items,
      isInterState,

      paymentMethod: "UPI",
      transactionId: `TXN-${Date.now()}`,
    };

    // Generate PDF
    const pdfBuffer = generateGSTInvoice(invoice);

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating GST invoice:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
