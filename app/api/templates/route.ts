/**
 * Create Campaign Template API
 * POST /api/templates
 * Save a campaign as a reusable template
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      campaignId, // Optional: create template from existing campaign
      category,
      budget,
      duration,
      requirements,
      niche,
      minFollowers,
      minEngagement,
      isPublic,
    } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "name and category are required" },
        { status: 400 }
      );
    }

    // If creating from existing campaign, fetch its details
    let campaignData = null;
    if (campaignId) {
      campaignData = await prisma.campaign.findFirst({
        where: {
          id: campaignId,
          brand: { userId: session.user.id },
        },
      });

      if (!campaignData) {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        );
      }
    }

    // Create template
    const template = await prisma.campaignTemplate.create({
      data: {
        name,
        description: description || campaignData?.description,
        category,
        budget: campaignData?.budget || budget || 0,
        duration: duration || 30,
        requirements: requirements || campaignData?.requirements,
        niche: niche || campaignData?.niche,
        minFollowers: minFollowers || 0,
        minEngagement: minEngagement || 0,
        brandId: session.user.id,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
