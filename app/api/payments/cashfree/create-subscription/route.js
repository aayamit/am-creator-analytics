import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;
const CASHFREE_ENV = process.env.CASHFREE_ENV || "sandbox";
const BASE_URL = CASHFREE_ENV === "production" 
  ? "https://api.cashfree.com" 
  : "https://sandbox.cashfree.com";

// Plan mapping (these should match plans created in Cashfree dashboard)
const PLAN_MAP = {
  "professional": process.env.CASHFREE_PLAN_PROFESSIONAL_ID || "plan_professional_monthly",
  "creator_pro": process.env.CASHFREE_PLAN_CREATOR_PRO_ID || "plan_creator_pro_monthly",
  "creator_elite": process.env.CASHFREE_PLAN_CREATOR_ELITE_ID || "plan_creator_elite_monthly",
};

/**
 * POST /api/payments/cashfree/create-subscription
 * Creates a Cashfree subscription and returns the auth link
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planType, customerDetails } = body;

    if (!planType || !PLAN_MAP[planType]) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        brandProfile: true,
        creatorProfile: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine customer name and email
    const customerName = user.name || customerDetails?.name || "Customer";
    const customerEmail = user.email || customerDetails?.email;
    const customerPhone = customerDetails?.phone || "+919999999999"; // Cashfree requires phone

    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email required" }, { status: 400 });
    }

    // Create subscription via Cashfree API
    const subscriptionPayload = {
      plan_id: PLAN_MAP[planType],
      customer_details: {
        customer_id: `user_${user.id}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      subscription_meta: {
        user_id: user.id,
        role: session.user.role,
        plan_type: planType,
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success?provider=cashfree`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/cashfree/webhook`,
    };

    const response = await fetch(`${BASE_URL}/pg/subscriptions`, {
      method: "POST",
      headers: {
        "x-client-id": CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_CLIENT_SECRET,
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(subscriptionPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree subscription error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create subscription" },
        { status: response.status }
      );
    }

    // Store subscription in DB (create a simple record)
    // You may want to create a Subscription model in Prisma later
    console.log("Cashfree subscription created:", data.subscription_id);

    return NextResponse.json({
      success: true,
      subscriptionId: data.subscription_id,
      authLink: data.auth_link, // Customer redirects here to authorize
    });

  } catch (error) {
    console.error("Cashfree create subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * GET /api/payments/cashfree/create-subscription
 * Check if user has existing subscription
 */
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Query subscription from DB when you create the Subscription model
    // For now, return empty
    return NextResponse.json({ exists: false });

  } catch (error) {
    console.error("Cashfree GET subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
