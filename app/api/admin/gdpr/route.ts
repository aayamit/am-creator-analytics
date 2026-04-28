import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware to check admin access
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    return { error: "Forbidden: Admin access required", status: 403 };
  }

  return { session, user };
}

// GET /api/admin/gdpr/export - Export user data (GDPR portability)
export async function GET(request: NextRequest) {
  const auth = await checkAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        brandProfile: {
          include: {
            campaigns: {
              include: {
                campaignCreators: true,
                trackingEvents: true,
              },
            },
          },
        },
        creatorProfile: {
          include: {
            socialAccounts: true,
            mediaKit: true,
            campaignCreators: {
              include: {
                campaign: true,
                deliverables: true,
                contract: true,
              },
            },
            payoutAccount: {
              include: {
                transactions: true,
              },
            },
          },
        },
        auditLogs: true,
        notifications: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Log the export
    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "GDPR_EXPORT",
        resource: `User:${userId}`,
        metadata: { exportedBy: auth.user.email },
      },
    });

    return NextResponse.json({ userData });
  } catch (error) {
    console.error("GDPR export error:", error);
    return NextResponse.json(
      { error: "Failed to export user data" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gdpr/delete - Delete user data (GDPR right to be forgotten)
export async function DELETE(request: NextRequest) {
  const auth = await checkAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const confirmation = searchParams.get("confirm");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "Must provide confirm=DELETE" },
        { status: 400 }
      );
    }

    // Log the deletion BEFORE deleting
    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "GDPR_DELETE",
        resource: `User:${userId}`,
        metadata: {
          deletedBy: auth.user.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "User data deleted successfully",
    });
  } catch (error) {
    console.error("GDPR delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete user data" },
      { status: 500 }
    );
  }
}
