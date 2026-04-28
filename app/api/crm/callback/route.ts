import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

const NANGO_BASE_URL = process.env.NANGO_BASE_URL || "http://localhost:3003";
const NANGO_SECRET_KEY = process.env.NANGO_SECRET_KEY || "";

/**
 * POST /api/crm/callback
 * Handle Nango OAuth callback
 * Frontend sends the connection_id after successful OAuth
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { connection_id, provider_config_key } = body;

    if (!connection_id || !provider_config_key) {
      return NextResponse.json(
        { error: "connection_id and provider_config_key required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { brandProfile: true },
    });

    if (!user?.brandProfile) {
      return NextResponse.json(
        { error: "Brand profile not found" },
        { status: 404 }
      );
    }

    // Verify connection exists in Nango and get details
    const nangoResponse = await fetch(
      `${NANGO_BASE_URL}/connection/${connection_id}?provider_config_key=${provider_config_key}`,
      {
        headers: {
          Authorization: `Bearer ${NANGO_SECRET_KEY}`,
        },
      }
    );

    if (!nangoResponse.ok) {
      throw new Error("Failed to verify Nango connection");
    }

    const nangoConnection = await nangoResponse.json();

    // Save connection to database
    // The accessToken field stores the Nango connection_id
    const connection = await prisma.crmConnection.upsert({
      where: {
        id: `nango-${connection_id}`,
      },
      create: {
        id: `nango-${connection_id}`,
        brandId: user.brandProfile.id,
        type: provider_config_key.toUpperCase() === "HUBSPOT" ? "HUBSPOT" : "SALESFORCE",
        accessToken: connection_id, // Store Nango connection_id
        lastSync: new Date(),
      },
      update: {
        lastSync: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      connection: {
        id: connection.id,
        type: connection.type,
        connectionId: connection_id,
        status: "COMPLETE",
      },
    });
  } catch (error) {
    console.error("CRM Callback Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete CRM connection" },
      { status: 500 }
    );
  }
}
