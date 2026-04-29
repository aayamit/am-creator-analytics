/**
 * API Route: Stripe Connect Onboarding
 * Creates or retrieves a Stripe Connect account for a creator
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/prisma';
import { createConnectAccount, getAccountStatus } from '@/lib/stripe-connect';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only creators can onboard
    if (session.user.role !== 'CREATOR') {
      return NextResponse.json({ error: 'Only creators can onboard' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { creatorProfile: true },
    });

    if (!user || !user.creatorProfile) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 });
    }

    // Check if already has Stripe account
    const existingAccount = await prisma.payoutAccount.findFirst({
      where: {
        userId: user.id,
        type: 'STRIPE_CONNECT',
      },
    });

    if (existingAccount?.accountId) {
      // Check account status
      const status = await getAccountStatus(existingAccount.accountId);
      if (status && !('error' in status)) {
        return NextResponse.json({
          success: true,
          accountId: existingAccount.accountId,
          status,
          alreadyOnboarded: true,
        });
      }
    }

    // Create new Stripe Connect account
    const result = await createConnectAccount(
      user.id,
      user.email!,
      'IN' // India
    );

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Save account to database
    await prisma.payoutAccount.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: 'STRIPE_CONNECT',
        },
      },
      update: {
        accountId: result.accountId,
        status: 'PENDING',
      },
      create: {
        userId: user.id,
        type: 'STRIPE_CONNECT',
        accountId: result.accountId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      accountId: result.accountId,
    });
  } catch (error: any) {
    console.error('Stripe onboarding error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get Stripe Connect account status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payoutAccount = await prisma.payoutAccount.findFirst({
      where: {
        userId: session.user.id,
        type: 'STRIPE_CONNECT',
      },
    });

    if (!payoutAccount?.accountId) {
      return NextResponse.json({ error: 'No Stripe account found' }, { status: 404 });
    }

    const status = await getAccountStatus(payoutAccount.accountId);
    
    return NextResponse.json({
      success: true,
      accountId: payoutAccount.accountId,
      status,
    });
  } catch (error: any) {
    console.error('Stripe status error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
