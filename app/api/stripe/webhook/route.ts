/**
 * API Route: Stripe Webhook Handler
 * Handles payout/transfer status updates from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe, handleStripeWebhook } from '@/lib/stripe-connect';
import { prisma } from '@/lib/prisma';


// Disable body parser for raw body (Stripe webhook needs raw body)
export const bodyParser = false;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log(`Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case 'payout.paid':
        await handlePayoutPaid(event.data.object);
        break;
      case 'payout.failed':
        await handlePayoutFailed(event.data.object);
        break;
      case 'transfer.created':
        await handleTransferCreated(event.data.object);
        break;
      case 'transfer.failed':
        await handleTransferFailed(event.data.object);
        break;
      case 'account.updated':
        await handleAccountUpdated(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handlePayoutPaid(payout: any) {
  console.log('Payout paid:', payout.id);
  
  // Update contract or payout record
  await prisma.contract.updateMany({
    where: {
      metadata: {
        path: ['payoutId'],
        equals: payout.id,
      },
    },
    data: {
      metadata: {
        payoutStatus: 'PAID',
        payoutPaidAt: new Date().toISOString(),
      },
    },
  });
}

async function handlePayoutFailed(payout: any) {
  console.log('Payout failed:', payout.id);
  
  await prisma.contract.updateMany({
    where: {
      metadata: {
        path: ['payoutId'],
        equals: payout.id,
      },
    },
    data: {
      metadata: {
        payoutStatus: 'FAILED',
        payoutFailureCode: payout.failure_code,
      },
    },
  });
}

async function handleTransferCreated(transfer: any) {
  console.log('Transfer created:', transfer.id);
}

async function handleTransferFailed(transfer: any) {
  console.log('Transfer failed:', transfer.id);
}

async function handleAccountUpdated(account: any) {
  console.log('Account updated:', account.id);
  
  // Update payout account status
  await prisma.payoutAccount.updateMany({
    where: { accountId: account.id },
    data: {
      status: account.charges_enabled && account.payouts_enabled ? 'ACTIVE' : 'PENDING',
      metadata: {
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
      },
    },
  });
}
