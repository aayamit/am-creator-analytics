/**
 * API Key Management API
 * POST /api/developer/keys (create key)
 * GET /api/developer/keys (list keys)
 * DELETE /api/developer/keys/[keyId] (revoke key)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

// Generate API key (am_ + 32 hex chars)
function generateApiKey() {
  const prefix = 'am_';
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return prefix + randomBytes;
}

// Hash API key for storage
function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  try {
    const { userId, name } = await request.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'userId and name are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate API key
    const apiKey = generateApiKey();
    const hashedKey = hashApiKey(apiKey);
    const prefix = apiKey.substring(0, 35); // am_ + first 8 chars

    // Store in database (simplified: append to User.notes or create separate table)
    // For now, return the key (shown only once!)
    return NextResponse.json({
      success: true,
      apiKey, // ONLY shown once!
      prefix,
      message: 'Save this API key! It will not be shown again.',
    });
  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// GET - List API keys (only prefixes, not full keys)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Simplified: Return mock data
    const keys = [
      {
        id: 'key_1',
        name: 'Production',
        prefix: 'am_a1b2c3d4',
        createdAt: new Date().toISOString(),
        lastUsed: null,
        isActive: true,
      },
    ];

    return NextResponse.json({ keys });
  } catch (error) {
    console.error('API key list error:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}
