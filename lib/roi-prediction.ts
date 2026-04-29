/**
 * ROI Prediction Algorithm
 * Predict campaign ROI based on historical data
 * Premium feature for Elite plan (₹999/month)
 */

import { prisma } from './prisma';

interface CampaignFeatures {
  budget: number;
  creatorCount: number;
  avgFollowerCount: number;
  avgEngagementRate: number;
  platform: string;
  industry: string;
}

interface ROIPrediction {
  predictedROI: number;
  confidence: number;
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  recommendation: string;
}

// Simple linear regression for ROI prediction
// In production, use a real ML model (TensorFlow.js or API call)
export async function predictCampaignROI(
  tenantId: string,
  features: CampaignFeatures
): Promise<ROIPrediction> {
  try {
    // 1. Fetch historical data for this tenant
    const historicalCampaigns = await prisma.campaign.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
      },
      include: {
        creators: {
          include: { creator: true },
        },
      },
    });

    // 2. Calculate average ROI from historical data
    const avgHistoricalROI = historicalCampaigns.length > 0
      ? historicalCampaigns.reduce((sum, c) => sum + (c.roi || 300), 0) / historicalCampaigns.length
      : 300; // Default 300% ROI

    // 3. Simple prediction based on features
    let predictedROI = avgHistoricalROI;
    const factors = [];

    // Budget factor
    if (features.budget > 500000) {
      predictedROI *= 1.2; // Bigger budgets get better ROI
      factors.push({
        factor: 'Budget',
        impact: 'positive' as const,
        description: 'Higher budget allows better creator selection',
      });
    }

    // Creator count factor
    if (features.creatorCount > 10) {
      predictedROI *= 1.1;
      factors.push({
        factor: 'Scale',
        impact: 'positive' as const,
        description: 'More creators = better reach',
      });
    }

    // Engagement rate factor
    if (features.avgEngagementRate > 5) {
      predictedROI *= 1.15;
      factors.push({
        factor: 'Engagement',
        impact: 'positive' as const,
        description: 'High engagement rates boost campaign performance',
      });
    } else if (features.avgEngagementRate < 2) {
      predictedROI *= 0.9;
      factors.push({
        factor: 'Engagement',
        impact: 'negative' as const,
        description: 'Low engagement may hurt performance',
      });
    }

    // Platform factor
    if (features.platform === 'Instagram') {
      predictedROI *= 1.05;
      factors.push({
        factor: 'Platform',
        impact: 'positive' as const,
        description: 'Instagram campaigns typically perform well',
      });
    }

    // 4. Generate recommendation
    let recommendation = '';
    if (predictedROI > 400) {
      recommendation = 'Excellent ROI predicted! Consider increasing budget to scale.';
    } else if (predictedROI > 250) {
      recommendation = 'Good ROI expected. Optimize creator selection for better results.';
    } else {
      recommendation = 'ROI may be lower than average. Consider adjusting budget or creator mix.';
    }

    // 5. Calculate confidence (based on amount of historical data)
    const confidence = Math.min(0.95, 0.5 + (historicalCampaigns.length * 0.05));

    return {
      predictedROI: Math.round(predictedROI),
      confidence,
      factors,
      recommendation,
    };
  } catch (error) {
    console.error('ROI prediction error:', error);
    throw error;
  }
}

// Helper: Calculate optimal budget allocation
export function optimizeBudgetAllocation(
  totalBudget: number,
  creators: Array<{ id: string; avgROI: number; minRate: number }>
): Array<{ creatorId: string; allocatedBudget: number }> {
  // Simple proportional allocation based on historical ROI
  const totalWeight = creators.reduce((sum, c) => sum + c.avgROI, 0);
  
  return creators.map(creator => ({
    creatorId: creator.id,
    allocatedBudget: Math.round((creator.avgROI / totalWeight) * totalBudget),
  }));
}
