import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// POST /api/payments/razorpay/webhook
export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(body)
    .digest("hex");
  
  if (expectedSignature !== signature) {
    console.error("Razorpay webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  
  const event = JSON.parse(body);
  const { event: eventType, payload } = event;
  
  try {
    switch (eventType) {
      case "contact.updated":
      case "contact.created":
        await handleContactUpdated(payload.contact.entity);
        break;
        
      case "fund_account.created":
      case "fund_account.updated":
        await handleFundAccountUpdated(payload.fund_account.entity);
        break;
        
      case "payout.created":
      case "payout.updated":
        await handlePayoutUpdated(payload.payout.entity);
        break;
        
      default:
        console.log(`Unhandled Razorpay event type: ${eventType}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleContactUpdated(contact) {
  const payoutAccount = await prisma.payoutAccount.findFirst({
    where: { providerAccountId: contact.id },
  });
  
  if (!payoutAccount) {
    console.log(`Payout account not found for Razorpay contact: ${contact.id}`);
    return;
  }
  
  // Update KYC status based on contact details
  const kycVerified = contact.verification_status === "verified";
  
  await prisma.payoutAccount.update({
    where: { id: payoutAccount.id },
    data: {
      kycVerified,
      status: kycVerified ? "ACTIVE" : "PENDING",
    },
  });
}

async function handleFundAccountUpdated(fundAccount) {
  // Log fund account updates (bank account linked)
  console.log("Fund account updated:", fundAccount.id);
}

async function handlePayoutUpdated(payout) {
  const transaction = await prisma.payoutTransaction.findFirst({
    where: { providerTxId: payout.id },
  });
  
  if (!transaction) {
    console.log(`Transaction not found for Razorpay payout: ${payout.id}`);
    return;
  }
  
  // Map Razorpay status to our status
  const statusMap = {
    "created": "PENDING",
    "processing": "PROCESSING",
    "processed": "PAID",
    "failed": "FAILED",
    "cancelled": "CANCELLED",
  };
  
  const newStatus = statusMap[payout.status] || "PENDING";
  
  await prisma.payoutTransaction.update({
    where: { id: transaction.id },
    data: {
      status: newStatus,
      processedAt: payout.status === "processed" ? new Date() : undefined,
      metadata: {
        razorpayPayoutId: payout.id,
        mode: payout.mode,
        fundAccountId: payout.fund_account_id,
      },
    },
  });
}
