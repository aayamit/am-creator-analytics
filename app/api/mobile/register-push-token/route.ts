/**
 * Register Push Token API
 * POST /api/mobile/register-push-token
 * Registers Expo push token for a user
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

interface RegisterPushTokenBody {
  token: string;
  platform: "ios" | "android";
  deviceId: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: RegisterPushTokenBody = await request.json();
    const { token, platform, deviceId } = body;

    if (!token || !platform) {
      return NextResponse.json(
        { error: "token and platform are required" },
        { status: 400 }
      );
    }

    // Upsert push token (update if exists for this device)
    const pushToken = await prisma.pushToken.upsert({
      where: {
        deviceId_userId: {
          deviceId,
          userId: session.user.id,
        },
      },
      update: {
        token,
        platform,
        updatedAt: new Date(),
      },
      create: {
        token,
        platform,
        deviceId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      id: pushToken.id,
    });
  } catch (error) {
    console.error("Error registering push token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PushToken model (add to Prisma schema later)
 * model PushToken {
 *   id        String   @id @default(cuid())
 *   token     String   @unique
 *   platform  String   // 'ios' or 'android'
 *   deviceId  String
 *   userId    String
 *   user      User     @relation(fields: [userId], references: [id])
 *   createdAt DateTime @default(now())
 *   updatedAt DateTime @updatedAt
 *
 *   @@unique([deviceId, userId])
 *   @@map("push_tokens")
 * }
 */
