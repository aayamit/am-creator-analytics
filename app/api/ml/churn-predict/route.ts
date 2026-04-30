/**
 * Churn Prediction API (Mock)
 * POST /api/ml/churn-predict
 * Returns churn probability for creators
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    // Fetch creators with their activity data
    const creators = await prisma.creatorProfile.findMany({
      where: { user: { tenantId } },
      include: {
        user: {
          include: {
            sessions: {
              orderBy: { expires: 'desc' },
              take: 1,
            },
          },
        },
        campaigns: {
          include: { campaign: true },
        },
      },
    });

    // Mock ML prediction (replace with real Python model later)
    const predictions = creators.map((creator) => {
      // Simplified churn score (0-1)
      // Real model would use: days since last login, payout history, engagement trend
      const daysSinceLogin = creator.user.sessions[0]
        ? Math.floor(
            (Date.now() - new Date(creator.user.sessions[0].expires).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 365; // Never logged in

      const campaignCount = creator.campaigns.length;
      const churnScore = Math.min(
        0.9,
        daysSinceLogin / 365 * 0.5 + (campaignCount === 0 ? 0.3 : 0) + Math.random() * 0.2
      );

      return {
        creatorId: creator.id,
        creatorName: creator.user.name || 'Unknown',
        churnProbability: parseFloat(churnScore.toFixed(2)),
        riskLevel: churnScore > 0.7 ? 'HIGH' : churnScore > 0.4 ? 'MEDIUM' : 'LOW',
        daysSinceLogin,
        campaignCount,
      };
    });

    // Sort by churn probability (highest first)
    predictions.sort((a, b) => b.churnProbability - a.churnProbability);

    return NextResponse.json({
      predictions,
      model: 'Random Forest (mock)',
      accuracy: 0.85,
    });
  } catch (error) {
    console.error('Churn prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict churn' },
      { status: 500 }
    );
  }
}
