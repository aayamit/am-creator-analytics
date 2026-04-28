import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "CREATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { platform: platformParam } = await params;
    const platform = platformParam.toUpperCase();

    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!creatorProfile) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    // Delete from SocialAccount table
    await prisma.socialAccount.deleteMany({
      where: {
        creatorId: creatorProfile.id,
        platform: platform as any,
      },
    });

    // Also delete from NextAuth Account table (OAuth accounts)
    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: platform === "YOUTUBE" ? "google" : "linkedin",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
