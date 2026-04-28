import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;
const CASHFREE_ENV = process.env.CASHFREE_ENV || "sandbox";
const BASE_URL = CASHFREE_ENV === "production" 
  ? "https://api.cashfree.com" 
  : "https://sandbox.cashfree.com";

/**
 * POST /api/payments/cashfree/webhook
 * Handles Cashfree webhook events for subscriptions
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-webhook-signature") || 
                 req.headers.get("x-cf-signature");

    // Verify webhook signature (recommended for production)
    // Cashfree uses HMAC-SHA256 of the payload with your client secret
    // TODO: Implement signature verification for production
    
    console.log("Cashfree webhook received:", body.event, body);

    const { event, data } = body;

    switch (event) {
      case "SUBSCRIPTION_AUTHORIZED":
        await handleSubscriptionAuthorized(data);
        break;

      case "SUBSCRIPTION_COMPLETED":
      case "SUBSCRIPTION_ACTIVATED":
        await handleSubscriptionActive(data);
        break;

      case "SUBSCRIPTION_CANCELLED":
        await handleSubscriptionCancelled(data);
        break;

      case "PAYMENT_SUCCESS":
        await handlePaymentSuccess(data);
        break;

      case "PAYMENT_FAILED":
        await handlePaymentFailed(data);
        break;

      default:
        console.log(`Unhandled Cashfree event: ${event}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Cashfree webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Handle subscription authorized - customer authorized the mandate
 */
async function handleSubscriptionAuthorized(data) {
  const { subscription_id, subscription_meta } = data;
  console.log("Subscription authorized:", subscription_id);

  // You can update DB here if you have a Subscription model
  // For now, log it
}

/**
 * Handle subscription active - ready to charge
 */
async function handleSubscriptionActive(data) {
  const { subscription_id, customer_details, subscription_meta } = data;
  console.log("Subscription active:", subscription_id);

  const userId = subscription_meta?.user_id;
  const planType = subscription_meta?.plan_type;

  if (!userId || !planType) {
    console.log("No user_id or plan_type in subscription_meta");
    return;
  }

  // Update user's plan tier in DB
  const planTierMap = {
    "professional": "PROFESSIONAL",
    "creator_pro": "CREATOR_PRO",
    "creator_elite": "CREATOR_ELITE",
  };

  const newTier = planTierMap[planType];
  if (!newTier) {
    console.log(`Unknown plan type: ${planType}`);
    return;
  }

  // Update user role/plan in DB
  // TODO: Add a `planTier` field to User model or create Subscription model
  console.log(`User ${userId} upgraded to ${newTier}`);
  
  // Example: await prisma.user.update({ where: { id: userId }, data: { planTier: newTier } });
}

/**
 * Handle subscription cancelled
 */
async function handleSubscriptionCancelled(data) {
  const { subscription_id, subscription_meta } = data;
  console.log("Subscription cancelled:", subscription_id);

  const userId = subscription_meta?.user_id;
  if (userId) {
    // Revert user to free tier
    console.log(`User ${userId} subscription cancelled`);
  }
}

/**
 * Handle payment success
 */
async function handlePaymentSuccess(data) {
  const { subscription_id, payment_id, amount, subscription_meta } = data;
  console.log("Payment success:", payment_id, "Amount:", amount);

  // Log payment, send confirmation email, etc.
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(data) {
  const { subscription_id, payment_id, reason, subscription_meta } = data;
  console.log("Payment failed:", payment_id, "Reason:", reason);

  const userId = subscription_meta?.user_id;
  if (userId) {
    // Notify user about payment failure
    console.log(`Notify user ${userId} about payment failure`);
  }
}

/**
 * GET /api/payments/cashfree/webhook
 * Health check
 */
export async function GET(req) {
  return NextResponse.json({ status: "Cashfree webhook endpoint active" });
}
