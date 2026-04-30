/**
 * 2FA Enable/Disable API
 * POST /api/auth/2fa/enable (enable 2FA)
 * POST /api/auth/2fa/disable (disable 2FA)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Enable 2FA
export async function POST(request: NextRequest) {
  try {
    const { userId, password, token } = await request.json();

    if (!userId || !password || !token) {
      return NextResponse.json(
        { error: 'userId, password, and token are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, twoFactorSecret: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password || '');
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Verify TOTP token
    if (user.twoFactorSecret) {
      const { secret } = JSON.parse(user.twoFactorSecret);
      const speakeasy = require('speakeasy');
      const tokenValid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
      });

      if (!tokenValid) {
        return NextResponse.json(
          { error: 'Invalid 2FA token' },
          { status: 401 }
        );
      }
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json(
      { error: 'Failed to enable 2FA' },
      { status: 500 }
    );
  }
}

// Disable 2FA
export async function PUT(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { error: 'userId and password are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password || '');
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Disable 2FA and clear secrets
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    );
  }
}
