import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

function buildProfileUrl(
  platform: string,
  username?: string | null,
  accountId?: string | null
) {
  if (!username && !accountId) {
    return null;
  }

  if (platform === "INSTAGRAM" && username) {
    return `https://www.instagram.com/${username}/`;
  }

  if (platform === "LINKEDIN" && (username || accountId)) {
    return `https://www.linkedin.com/in/${username || accountId}/`;
  }

  if (platform === "YOUTUBE" && (username || accountId)) {
    return `https://www.youtube.com/${username ? `@${username}` : `channel/${accountId}`}`;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role as "BRAND" | "CREATOR";

    // Fetch user with role-specific profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        BrandProfile: true,
        CreatorProfile: {
          include: {
            SocialAccount: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build response based on role
    const response: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: null,
    };

    if (role === "CREATOR" && user.CreatorProfile) {
      response.profile = {
        id: user.CreatorProfile.id,
        displayName: user.CreatorProfile.displayName,
        niche: user.CreatorProfile.niche,
        bio: user.CreatorProfile.bio,
        website: user.CreatorProfile.website,
        socialAccounts: user.CreatorProfile.SocialAccount.map((sa) => ({
          platform: sa.platform,
          username: sa.username,
          profileUrl: buildProfileUrl(sa.platform, sa.username, sa.accountId),
        })),
      };
    } else if (role === "BRAND" && user.BrandProfile) {
      response.profile = {
        id: user.BrandProfile.id,
        companyName: user.BrandProfile.companyName,
        industry: user.BrandProfile.industry,
        website: user.BrandProfile.website,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
