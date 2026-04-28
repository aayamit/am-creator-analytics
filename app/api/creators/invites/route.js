import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/creators/invites - Get invites for the creator
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!creatorProfile) {
      return NextResponse.json({ invites: [] });
    }

    // Get invites for this creator
    const invites = await prisma.campaignInvite.findMany({
      where: {
        creatorId: creatorProfile.id,
      },
      include: {
        campaign: {
          include: {
            brand: true,
          },
        },
        inviter: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Fetch creator invites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}
