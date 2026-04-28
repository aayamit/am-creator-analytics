import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

const NANGO_BASE_URL = process.env.NANGO_BASE_URL || "http://localhost:3003";

/**
 * POST /api/crm/connect
 * Generate Nango OAuth URL for connecting a CRM
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { crmType = "salesforce" } = body;

    if (!["salesforce", "hubspot"].includes(crmType)) {
      return NextResponse.json(
        { error: "Invalid CRM type. Must be 'salesforce' or 'hubspot'" },
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

    // Nango uses a redirect flow - build the OAuth URL
    // In production, the frontend should use Nango's frontend SDK
    // to initiate the connection with: Nango.auth('salesforce', 'user-id')
    const connectionId = `brand-${user.brandProfile.id}`;
    const nangoAuthUrl = `${NANGO_BASE_URL}/oauth/authorize`;
    
    const params = new URLSearchParams({
      provider_config_key: crmType,
      connection_id: connectionId,
      redirect_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/brands/crm/callback`,
    });

    return NextResponse.json({
      authUrl: `${nangoAuthUrl}?${params.toString()}`,
      connectionId,
      message: "Use Nango frontend SDK: Nango.auth(providerConfigKey, connectionId)",
    });
  } catch (error) {
    console.error("CRM Connect Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to connect CRM" },
      { status: 500 }
    );
  }
}
