import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

// Helper to make Razorpay API calls
async function razorpayApi(path, method = "POST", data) {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  
  const res = await fetch(`${RAZORPAY_API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${auth}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Razorpay API error: ${JSON.stringify(error)}`);
  }
  
  return res.json();
}

// POST /api/payments/razorpay/connect - Create or get Razorpay contact
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "CREATOR") {
      return NextResponse.json({ error: "Forbidden: Creator access required" }, { status: 403 });
    }
    
    const body = await req.json();
    const { name, email, phone, panNumber } = body;
    
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
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
    
    // Create Razorpay contact if not exists
    if (!payoutAccount || payoutAccount.provider !== "RAZORPAY") {
      const contact = await razorpayApi("/contacts", "POST", {
        name,
        email,
        contact: phone || "",
        type: "employee",
        reference_id: creatorProfile.id,
        notes: {
          creatorId: creatorProfile.id,
        },
      });
      
      // Create or update payout account in DB
      if (payoutAccount) {
        payoutAccount = await prisma.payoutAccount.update({
          where: { id: payoutAccount.id },
          data: {
            provider: "RAZORPAY",
            providerAccountId: contact.id,
            status: "PENDING",
            currency: "INR",
            kycVerified: false,
          },
        });
      } else {
        payoutAccount = await prisma.payoutAccount.create({
          data: {
            creatorId: creatorProfile.id,
            provider: "RAZORPAY",
            providerAccountId: contact.id,
            status: "PENDING",
            currency: "INR",
          },
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      contactId: payoutAccount.providerAccountId,
      account: {
        id: payoutAccount.id,
        status: payoutAccount.status,
        kycVerified: payoutAccount.kycVerified,
      },
    });
    
  } catch (error) {
    console.error("Razorpay Connect error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay account" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET /api/payments/razorpay/connect - Get Razorpay account status
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
    
    // Fetch contact from Razorpay to get latest status
    if (account.provider === "RAZORPAY") {
      try {
        const contact = await razorpayApi(`/contacts/${account.providerAccountId}`, "GET");
        
        return NextResponse.json({
          exists: true,
          account: {
            id: account.id,
            provider: account.provider,
            status: account.status,
            kycVerified: account.kycVerified,
            onboardingComplete: account.onboardingComplete,
            razorpayContactId: account.providerAccountId,
            contactStatus: contact.active ? "active" : "inactive",
          },
        });
      } catch (razorpayError) {
        console.error("Razorpay fetch error:", razorpayError);
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
    console.error("Razorpay Connect GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
