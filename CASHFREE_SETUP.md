# Cashfree Subscription Integration - Setup Guide

## 1. Get Cashfree Credentials

1. Sign up at [Cashfree Merchant Dashboard](https://merchant.cashfree.com)
2. Go to **Settings → API Keys**
3. Copy **Client ID** and **Client Secret**
4. Start with **Sandbox mode** (toggle in dashboard)

---

## 2. Update Environment Variables

Add to `.env.local`:

```env
# Cashfree (Sandbox - for testing)
CASHFREE_CLIENT_ID=your_client_id_here
CASHFREE_CLIENT_SECRET=your_client_secret_here
CASHFREE_ENV=sandbox

# Plan IDs (create these in Cashfree dashboard first)
CASHFREE_PLAN_PROFESSIONAL_ID=plan_professional_monthly
CASHFREE_PLAN_CREATOR_PRO_ID=plan_creator_pro_monthly
CASHFREE_PLAN_CREATOR_ELITE_ID=plan_creator_elite_monthly
```

Switch to production when ready:
```env
CASHFREE_ENV=production
```

---

## 3. Create Plans in Cashfree Dashboard

1. Login to [Cashfree Dashboard](https://merchant.cashfree.com)
2. Go to **Subscriptions → Plans → Create Plan**
3. Create these plans:

| Plan Name | Plan ID | Amount | Period |
|-----------|----------|--------|--------|
| Professional | `plan_professional_monthly` | ₹299 | Monthly |
| Creator Pro | `plan_creator_pro_monthly` | ₹29 | Monthly |
| Creator Elite | `plan_creator_elite_monthly` | ₹99 | Monthly |

**Note:** Plan IDs must match what you put in `CASHFREE_PLAN_*_ID` env vars.

---

## 4. Setup Webhook

1. In Cashfree Dashboard → **Settings → Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payments/cashfree/webhook`
3. Select events:
   - ✅ `SUBSCRIPTION_AUTHORIZED`
   - ✅ `SUBSCRIPTION_COMPLETED`
   - ✅ `SUBSCRIPTION_CANCELLED`
   - ✅ `PAYMENT_SUCCESS`
   - ✅ `PAYMENT_FAILED`
4. Copy the **Webhook Secret** (add to env as `CASHFREE_WEBHOOK_SECRET`)

---

## 5. Update Prisma Schema (Optional but Recommended)

Add this to `prisma/schema.prisma`:

```prisma
model Subscription {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  provider        String   // "CASHFREE"
  providerSubId   String   @unique // Cashfree subscription_id
  planType        String   // "professional", "creator_pro", etc.
  
  status          String   @default("PENDING") // PENDING, ACTIVE, CANCELLED, EXPIRED
  currentPeriodEnd DateTime?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("subscriptions")
}
```

Then run:
```bash
npx prisma migrate dev --name=add-subscription-model
```

---

## 6. Test the Flow

### Sandbox Testing:

1. Start dev server: `npm run dev`
2. Go to `/pricing`
3. Click "Start Free Trial" (Professional plan)
4. You'll be redirected to Cashfree sandbox
5. Use **test credentials** (see Cashfree docs)
6. Complete authorization
7. Check webhook logs: `tail -f .next/dev/logs/*.log`

### Test Cards (Cashfree Sandbox):
- **Success**: 4111 1111 1111 1111 (any future expiry, any CVV)
- **Failure**: 4111 1111 1111 0000

---

## 7. Go Live Checklist

- [ ] Switch `CASHFREE_ENV=production`
- [ ] Update plan IDs to production plans
- [ ] Complete Cashfree KYC (PAN, bank account)
- [ ] Test with ₹1 transaction
- [ ] Setup webhook for production URL
- [ ] Monitor webhook events in dashboard

---

## 8. API Routes Created

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/payments/cashfree/create-subscription` | POST | Creates subscription, returns auth link |
| `/api/payments/cashfree/create-subscription` | GET | Check existing subscription |
| `/api/payments/cashfree/webhook` | POST | Handle Cashfree events |

---

## 9. Frontend Integration

Update your pricing page buttons to call the API:

```typescript
const handleSubscribe = async (planType: string) => {
  const res = await fetch('/api/payments/cashfree/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planType }),
  });
  
  const data = await res.json();
  
  if (data.authLink) {
    window.location.href = data.authLink; // Redirect to Cashfree
  }
};
```

---

## 10. Cashfree vs Stripe Decision

| Criteria | Cashfree | Stripe |
|-----------|----------|--------|
| **Indian market** | ✅ Native UPI Auto-pay | ⚠️ Limited |
| **Pricing (India)** | ~2% + GST | ~3% + GST |
| **Existing code** | ❌ New integration | ✅ Stripe Connect exists |
| **Global** | ⚠️ 180+ countries | ✅ 135+ countries |

**Recommendation**: Use **Cashfree for Indian brands**, keep **Stripe for creator payouts** (already integrated).

---

## Support

- [Cashfree Docs](https://docs.cashfree.com)
- [Cashfree Discord](https://discord.com/invite/ed9VWdNrh7)
- [GitHub Examples](https://github.com/cashfree)
