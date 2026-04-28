import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/leads - Fetch all leads for the authenticated brand
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Forbidden: Brand access required" }, { status: 403 });
    }
    
    // Get brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }
    
    // Fetch leads through campaigns owned by this brand
    const leads = await prisma.lead.findMany({
      where: {
        campaign: {
          brandId: brandProfile.id,
        },
      },
      include: {
        campaign: {
          select: { id: true, title: true },
        },
        creator: {
          select: { id: true, displayName: true, niche: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
