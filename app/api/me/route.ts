import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        brandProfile: true,
        creatorProfile: {
          include: {
            socialAccounts: true,
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
      image: user.image,
    };

    if (role === "CREATOR" && user.creatorProfile) {
      response.profile = {
        id: user.creatorProfile.id,
        displayName: user.creatorProfile.displayName,
        niche: user.creatorProfile.niche,
        bio: user.creatorProfile.bio,
        website: user.creatorProfile.website,
        socialAccounts: user.creatorProfile.socialAccounts.map((sa) => ({
          platform: sa.platform,
          username: sa.username,
          profileUrl: sa.profileUrl,
        })),
      };
    } else if (role === "BRAND" && user.brandProfile) {
      response.profile = {
        id: user.brandProfile.id,
        companyName: user.brandProfile.companyName,
        industry: user.brandProfile.industry,
        website: user.brandProfile.website,
      };
    }

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
