import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: creatorId } = await params;

    // Fetch creator with full profile
    const creator = await prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      include: {
        user: true,
        socialAccounts: {
          include: {
            metrics: {
              orderBy: { date: "desc" },
              take: 30, // Last 30 data points
            },
          },
        },
        audienceDemographics: true,
        mediaKit: true,
      },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // Check permissions
    if (
      session.user.role === "CREATOR" &&
      session.user.id !== creator.userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Transform data
    const response = {
      id: creator.id,
      name: creator.displayName,
      niche: creator.niche,
      bio: creator.bio,
      website: creator.website,
      socialAccounts: creator.socialAccounts.map((account) => ({
        platform: account.platform,
        username: account.username,
        profileUrl: account.profileUrl,
        latestMetrics: account.metrics.slice(0, 10).map((m) => ({
          type: m.type,
          value: m.value.toNumber(),
          date: m.date,
        })),
      })),
      audienceDemographics: creator.audienceDemographics.map((d) => ({
        type: d.type,
        label: d.label,
        percentage: d.percentage.toNumber(),
      })),
      mediaKit: creator.mediaKit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
