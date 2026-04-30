/**
 * LTV Prediction API (Mock)
 * POST /api/ml/ltv-predict
 * Predicts lifetime value of creators
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

    // Fetch creators with earnings data
    const creators = await prisma.creatorProfile.findMany({
      where: { user: { tenantId } },
      include: {
        campaigns: {
          include: {
            campaign: true,
            payouts: true,
          },
        },
      },
    });

    // Mock LTV prediction (replace with real model later)
    const predictions = creators.map((creator) => {
      // Calculate average monthly earnings
      const totalEarnings = creator.campaigns.reduce((sum, cc) => {
        return sum + (cc.payouts?.amount || 0);
      }, 0);

      const avgMonthlyEarnings = totalEarnings / 12 || 5000; // Default ₹5k/month

      // Simplified LTV = avg_monthly * (1 / churn_rate) * margin
      // Mock churn rate: 20% annually (0.2)
      const churnRate = 0.2;
      const margin = 0.3; // 30% margin
      const ltv = (avgMonthlyEarnings * (1 / churnRate)) * margin;

      return {
        creatorId: creator.id,
        creatorName: creator.user.name || 'Unknown',
        predictedLTV: Math.round(ltv),
        avgMonthlyEarnings: Math.round(avgMonthlyEarnings),
        confidence: 0.82,
      };
    });

    // Sort by LTV (highest first)
    predictions.sort((a, b) => b.predictedLTV - a.predictedLTV);

    return NextResponse.json({
      predictions,
      model: 'Gradient Boosting Regressor (mock)',
      r2Score: 0.78,
    });
  } catch (error) {
    console.error('LTV prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict LTV' },
      { status: 500 }
    );
  }
}
