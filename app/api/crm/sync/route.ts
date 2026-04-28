import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { triggerSync, getSalesforceContacts, getHubspotContacts } from "@/lib/nango-client";

/**
 * POST /api/crm/sync
 * Sync contacts and deals from CRM via Nango
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { connectionId, syncType = "all" } = body;

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

    // Get CRM connection
    const connection = await prisma.crmConnection.findFirst({
      where: {
        id: connectionId,
        brandId: user.brandProfile.id,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "CRM connection not found" },
        { status: 404 }
      );
    }

    const results = {
      contacts: 0,
      deals: 0,
      errors: [] as string[],
    };

    // Trigger sync
    try {
      await triggerSync(
        connection.accessToken,
        connection.type === "SALESFORCE" ? "salesforce" : "hubspot",
        syncType === "contacts" ? "contacts" : undefined
      );
    } catch (error) {
      results.errors.push(
        `Sync trigger failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Fetch contacts if requested
    if (syncType === "contacts" || syncType === "all") {
      try {
        let contacts;
        if (connection.type === "SALESFORCE") {
          contacts = await getSalesforceContacts(connection.accessToken);
        } else {
          contacts = await getHubspotContacts(connection.accessToken);
        }
        results.contacts = contacts.length;

        // Update connection metadata
        await prisma.crmConnection.update({
          where: { id: connection.id },
          data: {
            lastSync: new Date(),
            syncErrors: results.errors.length > 0 
              ? { errors: results.errors } as any 
              : Prisma.JsonNull,
          },
        });
      } catch (error) {
        results.errors.push(
          `Contacts fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("CRM Sync Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync CRM" },
      { status: 500 }
    );
  }
}
