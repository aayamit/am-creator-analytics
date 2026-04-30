/**
 * AI Creator Recommendations API
 * Uses Groq (free tier) for LLM inference
 * Recommends creators for campaigns based on:
 * - Past performance
 * - Audience match
 * - Engagement rates
 * - Budget compatibility
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RecommendationRequest {
  campaignId: string;
  budget?: number;
  targetAudience?: string;
  platform?: string;
}

interface CreatorScore {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagementRate: number;
  pastROI: number;
  score: number;
  reasoning: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, budget, targetAudience, platform } = body as RecommendationRequest;

    if (!campaignId) {
      return NextResponse.json(
        { error: "campaignId is required" },
        { status: 400 }
      );
    }

    // 1. Fetch campaign details
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        creators: {
          include: {
            creator: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // 2. Fetch available creators (not already in campaign)
    const existingCreatorIds = campaign.creators.map((cc) => cc.creatorId);
    
    const availableCreators = await prisma.creatorProfile.findMany({
      where: {
        id: { notIn: existingCreatorIds },
        ...(platform && { platform }),
      },
      include: {
        user: true,
        socialAccounts: true,
      },
      take: 50, // Limit for LLM context
    });

    if (availableCreators.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: "No available creators found",
      });
    }

    // 3. Prepare data for LLM
    const campaignContext = `
Campaign: ${campaign.name}
Budget: ${budget || campaign.budget || "Not specified"}
Target Audience: ${targetAudience || "General"}
Platform: ${platform || "All"}
Description: ${campaign.description || "N/A"}
    `.trim();

    const creatorsData = availableCreators.map((creator) => ({
      id: creator.id,
      name: creator.user?.name || "Unknown",
      handle: creator.socialAccounts[0]?.username || "N/A",
      platform: creator.platform,
      followers: creator.followerCount || 0,
      engagementRate: creator.engagementRate || 0,
      pastROI: creator.roi || 0,
      avgViews: creator.avgViews || 0,
    }));

    // 4. Call Groq API (free tier)
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      // Fallback: simple scoring algorithm
      const recommendations = simpleScore(creatorsData, campaign, budget);
      return NextResponse.json({ recommendations });
    }

    const prompt = `
You are an AI assistant for a creator marketing platform (AM Creator Analytics).
Given a campaign and a list of creators, recommend the top 5-10 creators based on:
- Audience match with campaign target
- Past ROI performance  
- Engagement rate
- Budget compatibility
- Platform alignment

Campaign Context:
${campaignContext}

Available Creators (JSON):
${JSON.stringify(creatorsData, null, 2)}

Return a JSON array of recommended creators with this structure:
[
  {
    "id": "creator_id",
    "score": 85, // 0-100 score
    "reasoning": "Brief explanation of why this creator is recommended"
  }
]

Only return the JSON array, nothing else.
    `.trim();

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768", // Fast, free model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      }
    );

    if (!groqResponse.ok) {
      console.error("Groq API error:", await groqResponse.text());
      // Fallback to simple scoring
      const recommendations = simpleScore(creatorsData, campaign, budget);
      return NextResponse.json({ recommendations, fallback: true });
    }

    const groqData = await groqResponse.json();
    const llmOutput = groqData.choices?.[0]?.message?.content || "[]";

    let recommendations;
    try {
      const parsed = JSON.parse(llmOutput);
      recommendations = parsed.map((rec: any) => {
        const creator = creatorsData.find((c) => c.id === rec.id);
        return {
          ...creator,
          score: rec.score,
          reasoning: rec.reasoning,
        };
      }).filter(Boolean);
    } catch (error) {
      console.error("Failed to parse LLM output:", llmOutput);
      recommendations = simpleScore(creatorsData, campaign, budget);
    }

    return NextResponse.json({
      recommendations: recommendations.slice(0, 10),
      aiPowered: true,
    });
  } catch (error) {
    console.error("AI recommendation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Simple scoring algorithm (fallback if LLM fails)
 */
function simpleScore(
  creators: any[],
  campaign: any,
  budget?: number
): CreatorScore[] {
  return creators
    .map((creator) => {
      let score = 0;

      // Engagement rate (40% weight)
      score += (creator.engagementRate || 0) * 4;

      // Past ROI (30% weight)
      score += (creator.pastROI || 0) * 0.3;

      // Follower count (20% weight, logarithmic scale)
      const followerScore = Math.min(100, Math.log10(creator.followers || 1) * 25);
      score += followerScore * 0.2;

      // Platform match (10% weight)
      if (campaign.platform && creator.platform === campaign.platform) {
        score += 10;
      }

      return {
        ...creator,
        score: Math.round(score),
        reasoning: `Engagement: ${creator.engagementRate}%, ROI: ${creator.pastROI}%, Followers: ${creator.followers}`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
