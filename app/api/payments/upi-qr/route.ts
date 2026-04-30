/**
 * UPI QR Code Generator API
 * POST /api/payments/upi-qr
 * Generates QR code for UPI payment (Instant transfer)
 */

import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const { upiId, amount, note, payeeName } = await request.json();

    // Validate
    if (!upiId || !amount) {
      return NextResponse.json(
        { error: "UPI ID and amount required" },
        { status: 400 }
      );
    }

    // Validate UPI ID format (simple check)
    if (!upiId.includes('@')) {
      return NextResponse.json(
        { error: "Invalid UPI ID format (must contain '@')" },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Generate UPI deep link (as per NPCI spec)
    const upiLink = new URL("upi://pay");
    upiLink.searchParams.set("pa", upiId); // Payee address
    upiLink.searchParams.set("pn", payeeName || "AM Creator Analytics"); // Payee name
    upiLink.searchParams.set("am", numericAmount.toString()); // Amount
    upiLink.searchParams.set("cu", "INR"); // Currency
    if (note) {
      upiLink.searchParams.set("tn", note); // Transaction note
    }

    // Generate QR code as Data URL
    const qrDataUrl = await QRCode.toDataURL(upiLink.toString(), {
      errorCorrectionLevel: "H" as const,
      margin: 2,
      width: 300,
      color: {
        dark: "#1a1a2e", // Navy (Bloomberg)
        light: "#F8F7F4", // Cream (McKinsey)
      },
      type: "image/png",
    });

    return NextResponse.json({
      qrCode: qrDataUrl,
      upiLink: upiLink.toString(),
      amount: numericAmount,
      payeeName: payeeName || "AM Creator Analytics",
      // Instructions for user
      instructions: [
        "Open any UPI app (G Pay, PhonePe, Paytm)",
        "Scan QR code",
        "Verify amount and payee",
        "Complete payment",
      ],
    });
  } catch (error) {
    console.error("UPI QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
