/**
 * Quantum-Inspired Budget Optimization API
 * POST /api/optimize/budget
 * Uses simulated annealing for optimal budget allocation
 */

import { NextRequest, NextResponse } from "next/server";
import { optimizeBudget } from "@/lib/quantum-optimization";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, totalBudget } = body;

    if (!campaignId || !totalBudget) {
      return NextResponse.json(
        { error: 'campaignId and totalBudget are required' },
        { status: 400 }
      );
    }

    // Fetch campaign and creators
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        creators: {
          include: { creator: { include: { user: true } } },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Build creators array for optimization
    const creators = campaign.creators.map(cc => ({
      id: cc.creator.id,
      name: cc.creator.user.name || 'Unknown',
      costPerPost: cc.rate || 10000,
      expectedEngagement: 50, // Mock: would calculate from historical data
    }));

    if (creators.length === 0) {
      return NextResponse.json(
        { error: 'No creators found for this campaign' },
        { status: 400 }
      );
    }

    // Run optimization
    const optimalAllocation = optimizeBudget(creators, totalBudget);

    return NextResponse.json({
      success: true,
      campaignId,
      campaignName: campaign.name,
      totalBudget,
      allocation: optimalAllocation,
      totalExpectedEngagement: optimalAllocation.reduce((sum, a) => sum + a.expectedEngagement, 0),
      algorithm: 'Quantum-Inspired Simulated Annealing',
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize budget' },
      { status: 500 }
    );
  }
}
