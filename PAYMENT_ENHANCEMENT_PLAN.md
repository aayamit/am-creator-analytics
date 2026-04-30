# Payment Integration Enhancement Plan (PM-11)

## 🎯 Overview
Enhance payment system with **UPI QR codes** + **Netbanking**:
- **UPI QR Generation** (qrcode + UPI deep links)
- **Instant Payouts** via Razorpay/Stripe + UPI
- **Payment Request Links** (share via WhatsApp/SMS)
- **Transaction History** with GST invoice generation

## 📦 Open-Source Stack
- **qrcode**: QR code generation (MIT)
- **Razorpay API**: UPI payments (₹0 setup, 2% fee)
- **PDFKit**: GST invoice generation (MIT)
- **WhatsApp Business API**: Share payment links (self-hosted via Meta)

## 💰 Cost Savings
- **PayPal India**: 3.5% + ₹3 per transaction
- **Paytm Business**: 1.99% + GST
- **Our Approach**: 2% (Razorpay) + QR codes (no extra cost)

## 🎨 Bloomberg × McKinsey Design
- **QR Card**: Cream background (#F8F7F4), navy border (#1a1a2e)
- **Payment Links**: Bold typography, clear CTA
- **Transaction Table**: Minimalist rows, status badges
- **GST Invoice**: Professional layout, ready for tax filing

## 🛠️ Implementation Steps

### 1. Install Dependencies
```bash
npm install qrcode
npm install razorpay
```

### 2. Create UPI QR Generator API
```typescript
// app/api/payments/upi-qr/route.ts
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  const { upiId, amount, note, payeeName } = await request.json();

  // Validate
  if (!upiId || !amount) {
    return NextResponse.json(
      { error: "UPI ID and amount required" },
      { status: 400 }
    );
  }

  // Generate UPI deep link
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generate QR code as Data URL
  const qrDataUrl = await QRCode.toDataURL(upiLink, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 300,
    color: {
      dark: "#1a1a2e", // Navy
      light: "#F8F7F4", // Cream
    },
  });

  return NextResponse.json({
    qrCode: qrDataUrl,
    upiLink,
    amount,
    payeeName,
  });
}
```

### 3. Create QR Generator Component
```tsx
// components/payments/upi-qr-generator.tsx
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UPIQRGenerator({
  upiId: initialUpiId,
  amount: initialAmount,
  onGenerated,
}: {
  upiId?: string;
  amount?: number;
  onGenerated?: (qrCode: string) => void;
}) {
  const [upiId, setUpiId] = useState(initialUpiId || "");
  const [amount, setAmount] = useState(initialAmount?.toString() || "");
  const [note, setNote] = useState("Campaign payout");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payments/upi-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upiId,
          amount: parseFloat(amount),
          note,
          payeeName: "AM Creator Analytics",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate QR");

      const data = await response.json();
      setQrCode(data.qrCode);
      onGenerated?.(data.qrCode);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ border: "1px solid #e5e7eb", backgroundColor: "#FFFFFF" }}>
      <CardHeader>
        <CardTitle style={{ color: "#1a1a2e", fontSize: "16px" }}>
          UPI QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <Label>UPI ID</Label>
            <Input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="creator@upi"
            />
          </div>
          <div>
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          <div>
            <Label>Note</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Campaign payout"
            />
          </div>

          <Button
            onClick={generateQR}
            disabled={loading || !upiId || !amount}
            style={{
              backgroundColor: "#1a1a2e",
              color: "#F8F7F4",
            }}
          >
            {loading ? "Generating..." : "Generate QR Code"}
          </Button>

          {qrCode && (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <img
                src={qrCode}
                alt="UPI QR Code"
                style={{
                  maxWidth: "200px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px",
                  backgroundColor: "#F8F7F4",
                }}
              />
              <p style={{ fontSize: "12px", color: "#92400e", marginTop: "8px" }}>
                Scan with any UPI app (GPay, PhonePe, Paytm)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Create Payment Link API (Razorpay)
```typescript
// app/api/payments/create-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  const { amount, description, customerEmail, customerName } = await request.json();

  const paymentLink = await razorpay.paymentLink.create({
    amount: amount * 100, // paise
    currency: "INR",
    description,
    customer: {
      name: customerName,
      email: customerEmail,
    },
    notify: {
      email: true,
      sms: true,
    },
    callback_url: `${process.env.NEXTAUTH_URL}/payments/success`,
  });

  return NextResponse.json(paymentLink);
}
```

### 5. Add Payment Methods to Creator Profile
```prisma
model PaymentMethod {
  id             String   @id @default(cuid())
  creatorId     String
  creator       Creator  @relation(fields: [creatorId], references: [id])

  type           PaymentType
  upiId          String?  // For UPI
  bankName       String?
  accountNumber  String?  // Encrypted
  ifscCode       String?

  isDefault      Boolean  @default(false)
  verified       Boolean  @default(false)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("payment_methods")
}

enum PaymentType {
  UPI
  BANK_TRANSFER
  RAZORPAY
}
```

## ✅ Next Steps
1. Install `qrcode`, `razorpay`
2. Create `app/api/payments/upi-qr/route.ts`
3. Create `components/payments/upi-qr-generator.tsx`
4. Add `PaymentMethod` model to Prisma
5. Integrate into payout flow
6. Add WhatsApp sharing for payment links
7. Build transaction history page
8. Generate GST invoices (PDF)

## 🎯 Success Metrics
- **UPI adoption**: 80% of creators use UPI QR
- **Payment speed**: Instant vs 2-3 days (bank transfer)
- **Creator satisfaction**: "Easy payout" score > 4.5/5
- **Cost reduction**: Save 1.5% per transaction vs PayPal
