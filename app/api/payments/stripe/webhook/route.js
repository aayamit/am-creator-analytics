import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import crypto from "crypto";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// POST /api/payments/stripe/webhook
export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  
  try {
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object;
        await handleAccountUpdated(account);
        break;
      }
        
      case "transfer.created": {
        const transfer = event.data.object;
        await handleTransferCreated(transfer);
        break;
      }
        
      case "transfer.failed": {
        const transfer = event.data.object;
        await handleTransferFailed(transfer);
        break;
      }
        
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleAccountUpdated(account) {
  const payoutAccount = await prisma.payoutAccount.findFirst({
    where: { providerAccountId: account.id },
  });
  
  if (!payoutAccount) {
    console.log(`Payout account not found for Stripe account: ${account.id}`);
    return;
  }
  
  const status = account.charges_enabled ? "ACTIVE" : "PENDING";
  const kycVerified = account.details_submitted === true;
  
  await prisma.payoutAccount.update({
    where: { id: payoutAccount.id },
    data: {
      status,
      kycVerified,
      onboardingComplete: account.details_submitted || false,
      dashboardUrl: account.dashboard?.url || undefined,
    },
  });
  
  // Log compliance audit
  await prisma.complianceAudit.create({
    data: {
      resource: `PayoutAccount:${payoutAccount.id}`,
      resourceType: "PayoutAccount",
      resourceId: payoutAccount.id,
      action: "STRIPE_ACCOUNT_UPDATED",
      before: { status: payoutAccount.status, kycVerified: payoutAccount.kycVerified },
      after: { status, kycVerified },
      timestamp: new Date(),
      metadata: {
        stripeAccountId: account.id,
        chargesEnabled: account.charges_enabled,
        detailsSubmitted: account.details_submitted,
      },
    },
  });
}

async function handleTransferCreated(transfer) {
  // Find the payout transaction
  const transaction = await prisma.payoutTransaction.findFirst({
    where: { providerTxId: transfer.id },
  });
  
  if (transaction) {
    await prisma.payoutTransaction.update({
      where: { id: transaction.id },
      data: {
        status: "PAID",
        processedAt: new Date(),
        metadata: {
          stripeTransferId: transfer.id,
          destination: transfer.destination,
        },
      },
    });
  }
}

async function handleTransferFailed(transfer) {
  const transaction = await prisma.payoutTransaction.findFirst({
    where: { providerTxId: transfer.id },
  });
  
  if (transaction) {
    await prisma.payoutTransaction.update({
      where: { id: transaction.id },
      data: {
        status: "FAILED",
        metadata: {
          stripeTransferId: transfer.id,
          failureCode: transfer.failure_code,
          failureMessage: transfer.failure_message,
        },
      },
    });
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  // Log payment for campaign funding
  console.log("Payment succeeded:", paymentIntent.id);
  // This will be handled by the campaign funding logic
}
