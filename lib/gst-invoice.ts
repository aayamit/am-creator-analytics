/**
 * GST Invoice Generator
 * Generates GST-compliant PDF invoices for Indian creators
 * Uses pdfkit (MIT license)
 */

import PDFDocument from "pdfkit";
import { Readable } from "stream";
import { WritableBuffer } from "@/lib/buffer-helper"; // We'll create this

export interface InvoiceItem {
  description: string;
  hsnCode: string; // HSN/SAC code
  quantity: number;
  rate: number; // per unit
  gstRate: number; // 18% default
}

export interface GSTInvoice {
  invoiceNumber: string;
  invoiceDate: Date;
  placeOfSupply: string; // State code (e.g., "07" for Delhi)

  // Supplier (Brand/Platform)
  supplierName: string;
  supplierGstin: string;
  supplierAddress: string;
  supplierStateCode: string;

  // Recipient (Creator)
  recipientName: string;
  recipientGstin?: string; // Optional for unregistered
  recipientAddress: string;
  recipientStateCode: string;

  items: InvoiceItem[];

  // Payment details
  paymentMethod?: string; // UPI, Bank Transfer, etc.
  transactionId?: string;
}

export function generateGSTInvoice(invoice: GSTInvoice): Buffer {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    bufferPages: true,
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  
  // ---- HEADER ----
  // Navy background header
  doc.rect(0, 0, doc.page.width, 80).fill("#1a1a2e");
  
  doc
    .fontSize(24)
    .fillColor("#F8F7F4")
    .text("TAX INVOICE", 50, 35, { align: "center" });
  
  doc.moveDown(2);
  doc.fillColor("#1a1a2e").fontSize(10);

  // ---- INVOICE DETAILS ----
  const invoiceY = 100;
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 50, invoiceY);
  doc.text(`Date: ${invoice.invoiceDate.toLocaleDateString("en-IN")}`, 50, doc.y + 5);
  doc.text(`Place of Supply: ${invoice.placeOfSupply}`, 50, doc.y + 5);

  // ---- SUPPLIER & RECIPIENT ----
  const partyY = doc.y + 20;
  
  // Supplier
  doc.fontSize(12).text("Supplier (Brand)", 50, partyY, { underline: true });
  doc.fontSize(10)
    .text(invoice.supplierName, 50, doc.y + 5)
    .text(`GSTIN: ${invoice.supplierGstin}`, 50, doc.y + 3)
    .text(invoice.supplierAddress, 50, doc.y + 3, { width: 200 });

  // Recipient
  doc.fontSize(12).text("Recipient (Creator)", 300, partyY, { underline: true });
  doc.fontSize(10)
    .text(invoice.recipientName, 300, doc.y + 5)
    .text(`GSTIN: ${invoice.recipientGstin || "Unregistered"}`, 300, doc.y + 3)
    .text(invoice.recipientAddress, 300, doc.y + 3, { width: 200 });

  // ---- ITEMS TABLE ----
  doc.moveDown(4);
  
  const tableTop = doc.y;
  const tableHeaders = ["Description", "HSN/SAC", "Qty", "Rate", "Taxable Value"];
  const colWidths = [200, 80, 50, 80, 100];
  const colX = [50, 250, 330, 380, 430];
  
  // Table header background
  doc.rect(50, tableTop - 5, 500, 20).fill("#F8F7F4");
  doc.fillColor("#1a1a2e").fontSize(10);
  
  tableHeaders.forEach((header, i) => {
    doc.text(header, colX[i], tableTop, { width: colWidths[i], align: "left" });
  });
  
  // Table rows
  let rowY = tableTop + 25;
  let totalTaxable = 0;
  
  invoice.items.forEach((item, index) => {
    const taxableValue = item.quantity * item.rate;
    totalTaxable += taxableValue;
    
    // Row background (alternate)
    if (index % 2 === 0) {
      doc.rect(50, rowY - 5, 500, 20).fill("#f9fafb").fillColor("#1a1a2e");
    }
    
    doc.text(item.description, colX[0], rowY, { width: colWidths[0] });
    doc.text(item.hsnCode, colX[1], rowY);
    doc.text(item.quantity.toString(), colX[2], rowY);
    doc.text(`₹${item.rate.toLocaleString("en-IN")}`, colX[3], rowY);
    doc.text(`₹${taxableValue.toLocaleString("en-IN")}`, colX[4], rowY);
    
    rowY += 25;
  });
  
  // ---- GST CALCULATION ----
  const isInterState = invoice.supplierStateCode !== invoice.recipientStateCode;
  const gstRate = 0.18; // 18% GST
  
  const igst = isInterState ? totalTaxable * gstRate : 0;
  const cgst = !isInterState ? totalTaxable * gstRate / 2 : 0;
  const sgst = !isInterState ? totalTaxable * gstRate / 2 : 0;
  const totalGst = igst + cgst + sgst;
  const totalAmount = totalTaxable + totalGst;
  
  // GST Summary box
  const gstBoxY = rowY + 20;
  doc.rect(300, gstBoxY - 5, 250, 120).stroke("#e5e7eb").fill("#F8F7F4");
  
  doc.fillColor("#1a1a2e").fontSize(10);
  let gstY = gstBoxY + 10;
  
  doc.text("GST Summary", 310, gstY, { underline: true });
  gstY += 20;
  
  if (isInterState) {
    doc.text(`IGST (18%): ₹${igst.toFixed(2)}`, 310, gstY);
  } else {
    doc.text(`CGST (9%): ₹${cgst.toFixed(2)}`, 310, gstY);
    gstY += 15;
    doc.text(`SGST (9%): ₹${sgst.toFixed(2)}`, 310, gstY);
    gstY += 15;
  }
  
  doc
    .fontSize(12)
    .text(`Total GST: ₹${totalGst.toFixed(2)}`, 310, gstY + 5);
  
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(`Grand Total: ₹${totalAmount.toFixed(2)}`, 310, doc.y + 10);
  
  // ---- FOOTER ----
  const footerY = doc.page.height - 100;
  doc.rect(0, footerY - 20, doc.page.width, 80).fill("#1a1a2e");
  
  doc.fillColor("#F8F7F4").fontSize(10);
  doc.text(
    "This is a computer-generated invoice and does not require a signature.",
    50,
    footerY,
    { align: "center", width: doc.page.width - 100 }
  );
  
  if (invoice.paymentMethod) {
    doc.text(
      `Payment Method: ${invoice.paymentMethod} | Transaction ID: ${invoice.transactionId || "N/A"}`,
      50,
      doc.y + 5,
      { align: "center", width: doc.page.width - 100 }
    );
  }
  
  // ---- FINALIZE ----
  doc.end();
  
  return Buffer.concat(chunks);
}
