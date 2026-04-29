/**
 * API Route: Stripe Payouts
 * Send payouts to creators (test ₹1,500 signing bonus)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/prisma';
import { sendPayout, transferToCreator } from '@/lib/stripe-connect';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins/agency can send payouts
    if (!['ADMIN', 'AGENCY', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { creatorId, amount, description, method } = body;

    if (!creatorId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get creator's Stripe account
    const payoutAccount = await prisma.payoutAccount.findFirst({
      where: {
        userId: creatorId,
        type: 'STRIPE_CONNECT',
      },
    });

    if (!payoutAccount?.accountId) {
      return NextResponse.json({ error: 'Creator has no Stripe account' }, { status: 404 });
    }

    let result;
    if (method === 'transfer') {
      // Use transfer (recommended for marketplace)
      result = await transferToCreator(
        payoutAccount.accountId,
        amount, // in paise (₹1,500 = 150000)
        description || 'Creator payment'
      );
    } else {
      // Use payout (direct to bank)
      result = await sendPayout(
        payoutAccount.accountId,
        amount,
        description || 'Creator payment'
      );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Update contract if this is for a contract
    if (body.contractId) {
      await prisma.contract.update({
        where: { id: body.contractId },
        data: {
          bonusPaidAt: new Date(),
          metadata: {
            payoutId: result.payoutId || result.transferId,
            payoutMethod: method || 'payout',
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      payoutId: result.payoutId || result.transferId,
      method: method || 'payout',
    });
  } catch (error: any) {
    console.error('Stripe payout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
