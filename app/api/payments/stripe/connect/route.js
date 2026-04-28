import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// POST /api/payments/stripe/connect - Create or retrieve Stripe Connect account
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "CREATOR") {
      return NextResponse.json({ error: "Forbidden: Creator access required" }, { status: 403 });
    }
    
    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
      include: { payoutAccount: true },
    });
    
    if (!creatorProfile) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
    }
    
    let payoutAccount = creatorProfile.payoutAccount;
    
    // Create Stripe Connect account if not exists
    if (!payoutAccount || payoutAccount.provider !== "STRIPE") {
      // Create Stripe Express account
      const stripeAccount = await stripe.accounts.create({
        type: "express",
        country: "US", // Default to US, can be updated later
        email: session.user.email || undefined,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: "individual",
      });
      
      // Create or update payout account in DB
      if (payoutAccount) {
        payoutAccount = await prisma.payoutAccount.update({
          where: { id: payoutAccount.id },
          data: {
            provider: "STRIPE",
            providerAccountId: stripeAccount.id,
            status: "PENDING",
            currency: "USD",
          },
        });
      } else {
        payoutAccount = await prisma.payoutAccount.create({
          data: {
            creatorId: creatorProfile.id,
            provider: "STRIPE",
            providerAccountId: stripeAccount.id,
            status: "PENDING",
            currency: "USD",
          },
        });
      }
    }
    
    // Create account onboarding link
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: payoutAccount.providerAccountId,
      refresh_url: `${origin}/creators/settings?refresh=stripe`,
      return_url: `${origin}/creators/settings?success=stripe`,
      type: "account_onboarding",
    });
    
    // Update onboarding URL
    await prisma.payoutAccount.update({
      where: { id: payoutAccount.id },
      data: {
        onboardingUrl: accountLink.url,
      },
    });
    
    return NextResponse.json({
      success: true,
      onboardingUrl: accountLink.url,
      accountId: payoutAccount.providerAccountId,
    });
    
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe account" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET /api/payments/stripe/connect - Get Connect account status
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
      include: { payoutAccount: true },
    });
    
    if (!creatorProfile?.payoutAccount) {
      return NextResponse.json({ exists: false });
    }
    
    const account = creatorProfile.payoutAccount;
    
    // Check Stripe account status
    if (account.provider === "STRIPE") {
      try {
        const stripeAccount = await stripe.accounts.retrieve(account.providerAccountId);
        
        // Update status based on Stripe data
        const newStatus = stripeAccount.charges_enabled ? "ACTIVE" : "PENDING";
        const kycVerified = stripeAccount.details_submitted && stripeAccount.charges_enabled;
        
        await prisma.payoutAccount.update({
          where: { id: account.id },
          data: {
            status: newStatus,
            kycVerified,
            onboardingComplete: stripeAccount.details_submitted,
          },
        });
        
        return NextResponse.json({
          exists: true,
          account: {
            id: account.id,
            provider: account.provider,
            status: newStatus,
            kycVerified,
            onboardingComplete: stripeAccount.details_submitted,
            dashboardUrl: account.dashboardUrl,
          },
        });
      } catch (stripeError) {
        console.error("Stripe retrieve error:", stripeError);
      }
    }
    
    return NextResponse.json({
      exists: true,
      account: {
        id: account.id,
        provider: account.provider,
        status: account.status,
        kycVerified: account.kycVerified,
        onboardingComplete: account.onboardingComplete,
      },
    });
    
  } catch (error) {
    console.error("Stripe Connect GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
