import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/creators/media-kit - Get current user's media kit
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
      include: { mediaKit: true },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
    }

    // If no media kit exists, create one
    if (!creator.mediaKit) {
      const mediaKit = await prisma.mediaKit.create({
        data: {
          creatorId: creator.id,
          slug: `${creator.handle || creator.id}`,
          isPublic: false,
          settings: {
            showPastCampaigns: true,
            showPricing: true,
            showAudienceDemographics: true,
            showLiveMetrics: true,
            theme: "light",
            accentColor: "#C19A5B",
          },
        },
      });
      return NextResponse.json({ mediaKit });
    }

    return NextResponse.json({ mediaKit: creator.mediaKit });
  } catch (error) {
    console.error("Media kit fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media kit" },
      { status: 500 }
    );
  }
}

// PUT /api/creators/media-kit - Update media kit settings
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, isPublic, settings } = body;

    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
      include: { mediaKit: true },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
    }

    if (!creator.mediaKit) {
      return NextResponse.json({ error: "Media kit not found" }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (slug && slug !== creator.mediaKit.slug) {
      const existing = await prisma.mediaKit.findUnique({
        where: { slug },
      });
      if (existing) {
        return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
      }
    }

    const updated = await prisma.mediaKit.update({
      where: { id: creator.mediaKit.id },
      data: {
        ...(slug && { slug }),
        ...(isPublic !== undefined && { isPublic }),
        ...(settings && { settings }),
      },
    });

    return NextResponse.json({ mediaKit: updated });
  } catch (error) {
    console.error("Media kit update error:", error);
    return NextResponse.json(
      { error: "Failed to update media kit" },
      { status: 500 }
    );
  }
}
