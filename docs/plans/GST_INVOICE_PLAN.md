# GST Invoice Generation Plan (PM-12)

## 🎯 Overview
Build **GST-compliant invoice generation** for Indian creators:
- **GSTIN Validation** (15-digit GST number)
- **HSN/SAC Codes** (service codes for influencer marketing)
- **IGST/CGST/SGST Calculation** (inter-state vs intra-state)
- **PDF Invoice** with QR code (GSTN portal compliance)
- **Bulk Invoicing** for agencies (multiple creators per campaign)

## 📜 GST Rules for Influencer Marketing
- **SAC Code**: 9983 (Advertising services)
- **GST Rate**: 18% (standard rate for advertising)
- **Reverse Charge**: Sometimes applicable (brand pays GST)
- **Invoice Fields**: Invoice #, date, place of supply, HSN/SAC

## 💻 Open-Source Stack
- **PDFKit** (or **jspdf** already installed): PDF generation
- **Indian GST API** (validation): `https://services.gst.gov.in/`
- **QR Code**: `qrcode` (already installed for UPI)

## 💰 Cost Savings
- **Zoho Books**: ₹2,999/year
- **QuickBooks India**: ₹3,499/year  
- **Our Approach**: ₹0 (self-hosted PDF generation)

## 🎨 Bloomberg × McKinsey Design
- **Invoice Header**: Navy (#1a1a2e) background, cream (#F8F7F4) text
- **Table**: Minimalist rows, right-aligned amounts
- **GST Badge**: Green (#16a34a) for verified GSTIN
- **QR Code**: Placed bottom-right (GSTN compliance)

## 🛠️ Implementation Steps

### 1. Add GST Fields to PaymentMethod Model
```prisma
model PaymentMethod {
  // ... existing fields
  
  gstin         String?  // 15-digit GST number
  gstVerified   Boolean  @default(false)
  hsnCode       String   @default("9983") // SAC code for advertising
  placeOfSupply String?  // State code (e.g., "07" for Delhi)
  isInterState Boolean  @default(false) // IGST vs CGST+SGST
}
```

### 2. Create GST Invoice Generator (lib/gst-invoice.ts)
```typescript
import PDFDocument from "pdfkit";
import { ReadableStream } from "stream";

interface InvoiceItem {
  description: string;
  hsnCode: string;
  quantity: number;
  rate: number; // per unit
  gstRate: number; // 18% default
}

interface GSTInvoice {
  invoiceNumber: string;
  invoiceDate: Date;
  placeOfSupply: string;
  
  // Supplier (Platform/Brand)
  supplierName: string;
  supplierGstin: string;
  supplierAddress: string;
  
  // Recipient (Creator)
  recipientName: string;
  recipientGstin?: string; // Optional for unregistered
  recipientAddress: string;
  
  items: InvoiceItem[];
  
  // GST Calculation
  isInterState: boolean; // true = IGST, false = CGST+SGST
}

export function generateGSTInvoice(invoice: GSTInvoice): Buffer {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  
  doc.on("data", (chunk) => chunks.push(chunk));
  
  // Header
  doc.rect(0, 0, 595, 80).fill("#1a1a2e");
  doc
    .fontSize(24)
    .fillColor("#F8F7F4")
    .text("TAX INVOICE", 50, 40, { align: "center" });
  
  // Invoice Details
  doc.moveDown(2);
  doc.fillColor("#1a1a2e").fontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 50, doc.y, { continued: true })
     .text(`Date: ${invoice.invoiceDate.toLocaleDateString("en-IN")}`, { align: "right" });
  
  // Supplier & Recipient
  const yPos = doc.y + 20;
  doc.text("Supplier:", 50, yPos).text(invoice.supplierName, 50, doc.y + 5);
  doc.text("Recipient:", 300, yPos).text(invoice.recipientName, 300, doc.y + 5);
  
  // Items Table
  // ... (table logic with GST calculation)
  
  // GST Summary
  const gstRate = 0.18;
  const totalTaxable = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const igst = invoice.isInterState ? totalTaxable * gstRate : 0;
  const cgst = !invoice.isInterState ? totalTaxable * gstRate / 2 : 0;
  const sgst = !invoice.isInterState ? totalTaxable * gstRate / 2 : 0;
  
  const gstSummaryY = doc.y + 20;
  doc.text(`IGST (18%): ₹${igst.toFixed(2)}`, 400, gstSummaryY);
  if (!invoice.isInterState) {
    doc.text(`CGST (9%): ₹${cgst.toFixed(2)}`, 400, doc.y + 5);
    doc.text(`SGST (9%): ₹${sgst.toFixed(2)}`, 400, doc.y + 5);
  }
  
  doc.end();
  
  return Buffer.concat(chunks);
}
```

### 3. Create Invoice API Route
```typescript
// app/api/invoices/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGSTInvoice } from "@/lib/gst-invoice";

export async function POST(request: NextRequest) {
  const { campaignId, creatorId } = await request.json();
  
  // Fetch campaign + creator details
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { brand: true, creators: { where: { creatorId } } },
  });
  
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
  
  // Generate invoice
  const invoice = {
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date(),
    supplierName: campaign.brand.companyName || "AM Creator Analytics",
    supplierGstin: campaign.brand.gstin || "",
    recipientName: campaign.creators[0]?.creator.displayName || "",
    items: [
      {
        description: `Campaign: ${campaign.name}`,
        hsnCode: "9983",
        quantity: 1,
        rate: campaign.budget || 0,
        gstRate: 18,
      },
    ],
    isInterState: false, // Simplified
  };
  
  const pdfBuffer = generateGSTInvoice(invoice);
  
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
    },
  });
}
```

### 4. Add GSTIN to Brand Profile & Creator Profile
```prisma
model BrandProfile {
  // ... existing fields
  gstin         String?  // Brand's GSTIN
  panNumber     String?  // For verification
}

model CreatorProfile {
  // ... existing fields  
  gstin         String?  // Creator's GSTIN (if registered)
  panNumber     String?  // For tax filing
}
```

## ✅ Next Steps
1. Add `gstin` fields to `BrandProfile` and `CreatorProfile` in Prisma
2. Run `npx prisma migrate` (or `db push`)
3. Create `lib/gst-invoice.ts` (PDF generation)
4. Create `app/api/invoices/generate/route.ts`
5. Install `pdfkit` (if not already available)
6. Test invoice generation
7. Add "Download Invoice" button to payout page
8. Create GSTIN verification API (optional)

## 📊 Success Metrics
- **GST Compliance**: 100% invoices have valid GST fields
- **Creator Adoption**: 60% registered creators provide GSTIN
- **Time Saved**: 5 hours/month vs manual invoice creation
- **Legal Risk Reduction**: Avoid GST penalties (₹10K-100K)
