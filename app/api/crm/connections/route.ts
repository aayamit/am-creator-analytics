import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";
import { listConnections, getSyncStatus } from "@/lib/nango-client";

/**
 * GET /api/crm/connections
 * List all CRM connections for the brand
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Get CRM connections from database
    const connections = await prisma.crmConnection.findMany({
      where: { brandId: user.brandProfile.id },
    });

    // Enrich with Nango sync status
    const enrichedConnections = await Promise.all(
      connections.map(async (conn) => {
        try {
          const syncStatus = await getSyncStatus(
            conn.accessToken,
            conn.type === "SALESFORCE" ? "salesforce" : "hubspot"
          );
          return {
            ...conn,
            syncStatus: syncStatus[0] || null,
          };
        } catch {
          return {
            ...conn,
            syncStatus: null,
          };
        }
      })
    );

    return NextResponse.json({ connections: enrichedConnections });
  } catch (error) {
    console.error("CRM Connections GET Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch connections" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/connections
 * Delete a CRM connection
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get("id");

    if (!connectionId) {
      return NextResponse.json(
        { error: "Connection ID required" },
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

    // Verify connection belongs to brand
    const connection = await prisma.crmConnection.findFirst({
      where: {
        id: connectionId,
        brandId: user.brandProfile.id,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    // Delete from Nango first
    try {
      const { deleteConnection } = await import("@/lib/nango-client");
      await deleteConnection(
        connection.accessToken,
        connection.type === "SALESFORCE" ? "salesforce" : "hubspot"
      );
    } catch (err) {
      console.warn("Failed to delete Nango connection:", err);
      // Continue to delete from DB even if Nango fails
    }

    // Delete from database
    await prisma.crmConnection.delete({
      where: { id: connectionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CRM Connections DELETE Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete connection" },
      { status: 500 }
    );
  }
}
