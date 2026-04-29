/**
 * Stripe Connect Integration
 * Self-serve payouts for creators
 * Test ₹1,500 signing bonus payout
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

import Stripe from 'stripe';

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
}) : null;

export interface StripeConnectSession {
  url: string;
  accountId: string;
}

/**
 * Create a Stripe Connect account for a creator
 */
export async function createConnectAccount(
  userId: string,
  email: string,
  country: string = 'IN'
): Promise<StripeConnectSession | { error: string }> {
  if (!stripe) {
    return { error: 'Stripe not configured' };
  }

  try {
    // Check if account already exists
    const existingAccounts = await stripe.accounts.list({
      email,
      limit: 1,
    });

    let account;
    if (existingAccounts.data.length > 0) {
      account = existingAccounts.data[0];
    } else {
      // Create new Express account
      account = await stripe.accounts.create({
        type: 'express',
        country,
        email,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        business_type: 'individual',
      });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?refresh=stripe`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=stripe`,
      type: 'account_onboarding',
    });

    return {
      url: accountLink.url,
      accountId: account.id,
    };
  } catch (error: any) {
    console.error('Stripe Connect error:', error);
    return { error: error.message };
  }
}

/**
 * Get account status
 */
export async function getAccountStatus(accountId: string) {
  if (!stripe) {
    return { error: 'Stripe not configured' };
  }

  try {
    const account = await stripe.accounts.retrieve(accountId);
    return {
      id: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      country: account.country,
    };
  } catch (error: any) {
    console.error('Stripe account status error:', error);
    return { error: error.message };
  }
}

/**
 * Send payout (test ₹1,500 signing bonus)
 */
export async function sendPayout(
  accountId: string,
  amount: number, // in paise (₹1,500 = 150000 paise)
  description: string = 'Signing Bonus'
): Promise<{ success: boolean; payoutId?: string; error?: string }> {
  if (!stripe) {
    return { success: false, error: 'Stripe not configured' };
  }

  try {
    const payout = await stripe.payouts.create(
      {
        amount,
        currency: 'inr',
        description,
        method: 'instant', // or 'standard'
      },
      { stripeAccount: accountId }
    );

    return { success: true, payoutId: payout.id };
  } catch (error: any) {
    console.error('Stripe payout error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Transfer to connected account (alternative to payout)
 */
export async function transferToCreator(
  accountId: string,
  amount: number, // in paise
  description: string = 'Creator payment'
): Promise<{ success: boolean; transferId?: string; error?: string }> {
  if (!stripe) {
    return { success: false, error: 'Stripe not configured' };
  }

  try {
    const transfer = await stripe.transfers.create({
      amount,
      currency: 'inr',
      destination: accountId,
      description,
    });

    return { success: true, transferId: transfer.id };
  } catch (error: any) {
    console.error('Stripe transfer error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle Stripe webhook (payout/transfer status updates)
 */
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; event?: Stripe.Event; error?: string }> {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return { success: false, error: 'Stripe webhook not configured' };
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    return { success: true, event };
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return { success: false, error: error.message };
  }
}

export { stripe };
