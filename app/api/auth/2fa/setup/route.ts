/**
 * 2FA Setup API
 * POST /api/auth/2fa/setup
 * Generates TOTP secret + QR code for authenticator app
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `AM Creator Analytics:${user.email || user.name || user.id}`,
      issuer: 'AM Creator Analytics',
    });

    // Save secret to user (encryption should be added in production!)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: JSON.stringify({
          secret: secret.base32,
          encoding: 'base32',
        }),
      },
    });

    // Generate QR code
    const otpauth_url = speakeasy.otpauthURL({
      secret: secret.base32,
      encoding: 'base32',
      label: user.email || user.name || user.id,
      issuer: 'AM Creator Analytics',
    }) as string;

    const qrCodeDataURL = await QRCode.toDataURL(otpauth_url);

    // Generate backup codes (10 codes)
    const backupCodes = Array.from({ length: 10 }, () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    });

    // Hash and save backup codes
    const bcrypt = require('bcryptjs');
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => bcrypt.hash(code, 10))
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        backupCodes: JSON.stringify(hashedBackupCodes),
      },
    });

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeDataURL,
      backupCodes, // Only shown once!
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
}
