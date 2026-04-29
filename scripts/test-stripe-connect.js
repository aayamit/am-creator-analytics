/**
 * Test Stripe Connect Integration
 * Tests onboarding, account status, and ₹1,500 signing bonus payout
 */

const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');

const prisma = new PrismaClient();
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

async function main() {
  console.log('🧪 Testing Stripe Connect Integration...\n');

  if (!stripe) {
    console.error('❌ Stripe not configured. Set STRIPE_SECRET_KEY in .env');
    return;
  }

  // 1. Find the test creator (creator-pro@amcreator.com)
  const creator = await prisma.user.findFirst({
    where: { email: 'creator-pro@amcreator.com' },
    include: { creatorProfile: true },
  });

  if (!creator) {
    console.error('❌ Test creator not found. Run seed script first.');
    return;
  }

  console.log(`✅ Found creator: ${creator.email}`);

  // 2. Check if creator has a Stripe account
  let payoutAccount = await prisma.payoutAccount.findFirst({
    where: {
      userId: creator.id,
      type: 'STRIPE_CONNECT',
    },
  });

  if (!payoutAccount) {
    console.log('📝 Creating Stripe Connect account...');
    
    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'IN',
      email: creator.email,
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      business_type: 'individual',
    });

    payoutAccount = await prisma.payoutAccount.create({
      data: {
        userId: creator.id,
        type: 'STRIPE_CONNECT',
        accountId: account.id,
        status: 'PENDING',
      },
    });

    console.log(`✅ Created Stripe account: ${account.id}`);
    console.log(`🔗 Onboarding URL: https://dashboard.stripe.com/connect/accounts/${account.id}`);
  } else {
    console.log(`✅ Existing Stripe account: ${payoutAccount.accountId}`);
  }

  // 3. Check account status
  const account = await stripe.accounts.retrieve(payoutAccount.accountId);
  console.log('\n📊 Account Status:');
  console.log(`   - Charges enabled: ${account.charges_enabled}`);
  console.log(`   - Payouts enabled: ${account.payouts_enabled}`);
  console.log(`   - Details submitted: ${account.details_submitted}`);

  if (!account.details_submitted) {
    console.log('\n⚠️  Onboarding not complete. Creator needs to finish onboarding:');
    const accountLink = await stripe.accountLinks.create({
      account: payoutAccount.accountId,
      refresh_url: 'http://localhost:3000/dashboard/settings?refresh=stripe',
      return_url: 'http://localhost:3000/dashboard/settings?success=stripe',
      type: 'account_onboarding',
    });
    console.log(`🔗 Onboarding URL: ${accountLink.url}`);
  }

  // 4. Test ₹1,500 signing bonus payout (150000 paise)
  console.log('\n💰 Testing ₹1,500 signing bonus payout...');
  
  if (!account.payouts_enabled) {
    console.log('⚠️  Payouts not enabled yet. Skipping payout test.');
    console.log('   Complete onboarding first: https://dashboard.stripe.com/connect/accounts/' + payoutAccount.accountId);
  } else {
    try {
      // Send payout (instant or standard)
      const payout = await stripe.payouts.create(
        {
          amount: 150000, // ₹1,500 in paise
          currency: 'inr',
          description: 'Signing Bonus (Test)',
          method: 'instant', // or 'standard'
        },
        { stripeAccount: payoutAccount.accountId }
      );

      console.log(`✅ Payout created: ${payout.id}`);
      console.log(`   Amount: ₹${(payout.amount / 100).toFixed(2)}`);
      console.log(`   Status: ${payout.status}`);
      console.log(`   Method: ${payout.method}`);

      // Update contract in database
      const contract = await prisma.contract.findFirst({
        where: { bonusPaidAt: { not: null } },
      });

      if (contract) {
        await prisma.contract.update({
          where: { id: contract.id },
          data: {
            metadata: {
              ...(contract.metadata || {}),
              stripePayoutId: payout.id,
              payoutStatus: payout.status,
              payoutAmount: 150000,
            },
          },
        });
        console.log(`✅ Updated contract ${contract.id} with payout info`);
      }
    } catch (error) {
      console.error('❌ Payout failed:', error.message);
    }
  }

  // 5. List recent payouts
  console.log('\n📋 Recent Payouts:');
  const payouts = await stripe.payouts.list(
    { limit: 5 },
    { stripeAccount: payoutAccount.accountId }
  );

  if (payouts.data.length === 0) {
    console.log('   No payouts yet.');
  } else {
    payouts.data.forEach(p => {
      console.log(`   - ${p.id}: ₹${(p.amount / 100).toFixed(2)} (${p.status})`);
    });
  }

  console.log('\n✅ Test complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
