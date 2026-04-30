/**
 * Send Push Notification API
 * POST /api/mobile/send-push
 * Sends push notification to a user via Expo
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SendPushBody {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Expo push notification URL
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export async function POST(request: NextRequest) {
  try {
    const body: SendPushBody = await request.json();
    const { userId, title, body: messageBody, data } = body;

    if (!userId || !title || !messageBody) {
      return NextResponse.json(
        { error: "userId, title, and body are required" },
        { status: 400 }
      );
    }

    // Get user's push tokens
    const pushTokens = await prisma.pushToken.findMany({
      where: { userId },
    });

    if (pushTokens.length === 0) {
      return NextResponse.json(
        { error: "No push tokens found for user" },
        { status: 404 }
      );
    }

    // Prepare messages for Expo
    const messages = pushTokens.map((pushToken) => ({
      to: pushToken.token,
      sound: "default",
      title,
      body: messageBody,
      data: data || {},
    }));

    // Send to Expo push service
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Expo push error:", result);
      return NextResponse.json(
        { error: "Failed to send push notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tickets: result,
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
