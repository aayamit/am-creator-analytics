import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        campaigns: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: brandProfile.id,
      companyName: brandProfile.companyName,
      industry: brandProfile.industry,
      website: brandProfile.website,
      logoUrl: brandProfile.logoUrl,
      campaigns: brandProfile.campaigns.map((c) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        budget: c.budget.toNumber(),
        spent: c.spent.toNumber(),
        startDate: c.startDate,
        endDate: c.endDate,
      })),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, industry, website } = body;

    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!brandProfile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    const updated = await prisma.brandProfile.update({
      where: { id: brandProfile.id },
      data: {
        companyName,
        industry,
        website,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
