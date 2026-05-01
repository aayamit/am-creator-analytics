import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export async function GET(
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

    // Get social account
    const socialAccount = await prisma.socialAccount.findUnique({
      where: {
        creatorId_platform: {
          creatorId: creatorProfile.id,
          platform: platform as any,
        },
      },
    });

    if (!socialAccount) {
      return NextResponse.json(
        { error: "Social account not found" },
        { status: 404 }
      );
    }

    // For Instagram, fetch analytics from Instagram Graph API
    if (platform === "INSTAGRAM" && socialAccount.accessToken) {
      try {
        const instagramData = await fetchInstagramAnalytics(socialAccount.accessToken);
        return NextResponse.json({
          success: true,
          platform,
          data: instagramData,
          connected: true,
        });
      } catch (error) {
        console.error("Instagram API error:", error);
        return NextResponse.json(
          { error: "Failed to fetch Instagram analytics" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      platform,
      connected: true,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    let provider = "linkedin";
    if (platform === "YOUTUBE") {
      provider = "google";
    } else if (platform === "INSTAGRAM") {
      provider = "instagram";
    }

    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: provider,
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

// Helper: Fetch Instagram analytics using Graph API
async function fetchInstagramAnalytics(accessToken: string) {
  try {
    // Get user's Instagram business account
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );
    const userData = await userResponse.json();

    if (!userData.data || userData.data.length === 0) {
      return { followerCount: 0, mediaCount: 0 };
    }

    const pageId = userData.data[0].id;

    // Get Instagram business account
    const igResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );
    const igData = await igResponse.json();

    if (!igData.instagram_business_account?.id) {
      return { followerCount: 0, mediaCount: 0 };
    }

    const igBusinessId = igData.instagram_business_account.id;

    // Get Instagram insights
    const insightsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igBusinessId}?fields=followers_count,media_count&access_token=${accessToken}`
    );
    const insightsData = await insightsResponse.json();

    return {
      followerCount: insightsData.followers_count || 0,
      mediaCount: insightsData.media_count || 0,
      username: insightsData.username || "",
    };
  } catch (error) {
    console.error("Instagram API fetch error:", error);
    return { followerCount: 0, mediaCount: 0 };
  }
}
