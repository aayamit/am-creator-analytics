# Cashfree Integration Test Guide

## Test Profiles (Created by `prisma/seed-cashfree-test.js`)

### 1. Admin User
- **Email:** `admin@amcreator.com`
- **Password:** `test123456`
- **Role:** ADMIN
- **Subscription:** None (internal)
- **Test Scenario:** Monitor subscriptions, view revenue, manage users

---

### 2. Brand (Professional Plan)
- **Email:** `brand-test@amcreator.com`
- **Password:** `test123456`
- **Role:** BRAND
- **Plan:** Professional
- **Price:** ₹299/month
- **Test Scenario:** Subscribe via Cashfree, manage campaigns, invite creators

**Profile Details:**
- Company: TechCorp Inc.
- Industry: Technology / SaaS
- Website: https://techcorp.example.com
- Tax ID: 12-3456789

---

### 3. Creator Pro (₹29/mo)
- **Email:** `creator-pro@amcreator.com`
- **Password:** `test123456`
- **Role:** CREATOR
- **Plan:** Creator Pro
- **Price:** ₹29/month
- **Test Scenario:** Subscribe via Cashfree, view analytics, receive campaign invites

**Profile Details:**
- Display Name: Alex Techreview
- Niche: Tech
- YouTube: 215K subscribers, 6.8% engagement
- LinkedIn: Active
- Media Kit: https://amcreator.com/m/alex-techreview-pro

---

### 4. Creator Elite (₹99/mo)
- **Email:** `creator-elite@amcreator.com`
- **Password:** `test123456`
- **Role:** CREATOR
- **Plan:** Creator Elite
- **Price:** ₹99/month
- **Test Scenario:** Test premium features, 1:1 strategy sessions, custom branding

**Profile Details:**
- Display Name: Priya FinanceGuru
- Niche: Finance
- YouTube: 520K subscribers, 7.5% engagement
- Instagram: Active
- LinkedIn: Active
- Media Kit: https://amcreator.com/m/priya-finance-elite

---

## Cashfree Sandbox Test Credentials

### API Credentials (Sandbox)
```
CASHFREE_CLIENT_ID=TEST_CLIENT_ID_123456789
CASHFREE_CLIENT_SECRET=TEST_CLIENT_SECRET_abcdef
CASHFREE_ENV=sandbox
```

### Test Payment Methods (Indian Market)

#### UPI Auto-pay (Recommended for subscriptions)
- **UPI ID:** `testsuccess@okaxis` (Success)
- **UPI ID:** `testfailure@oksbi` (Failure)
- **PIN:** Any 4-6 digit number

#### Net Banking
| Bank | Success Code | Failure Code |
|------|-------------|--------------|
| HDFC  | `1234` | `4321` |
| ICICI | `1111` | `9999` |
| SBI   | `2222` | `8888` |

#### Test Cards (If card payments enabled)
| Type | Card Number | Expiry | CVV | Status |
|------|-------------|--------|-----|--------|
| Visa | 4111111111111111 | 12/28 | 123 | Success |
| MC | 5123456789012346 | 12/28 | 123 | Success |
| Rupay | 6074861000000001 | 12/28 | 123 | Success |

---

## Integration Test Flow

### Step 1: Seed the Database
```bash
cd /home/awcreator/workspace/am-creator-analytics
node prisma/seed-cashfree-test.js
```

### Step 2: Configure Environment
Add to `.env.local`:
```env
# Cashfree (Sandbox)
CASHFREE_CLIENT_ID=TEST_CLIENT_ID_123456789
CASHFREE_CLIENT_SECRET=TEST_CLIENT_SECRET_abcdef
CASHFREE_ENV=sandbox

# Cashfree Plan IDs (Create these in Cashfree dashboard)
CASHFREE_PLAN_BRAND_PROFESSIONAL=plan_professional_123
CASHFREE_PLAN_CREATOR_PRO=plan_creator_pro_456
CASHFREE_PLAN_CREATOR_ELITE=plan_creator_elite_789

# Stripe (For creator payouts - already configured)
STRIPE_SECRET_KEY=sk_test_...
```

### Step 3: Create Plans in Cashfree Dashboard
1. Login to [Cashfree Sandbox Dashboard](https://merchant.cashfree.com/sandbox)
2. Navigate to **Subscriptions → Plans**
3. Create these plans:

| Plan Name | Plan ID | Amount | Interval | Currency |
|-----------|---------|--------|----------|----------|
| Professional (Brand) | plan_professional_123 | 299 | MONTH | INR |
| Creator Pro | plan_creator_pro_456 | 29 | MONTH | INR |
| Creator Elite | plan_creator_elite_789 | 99 | MONTH | INR |

### Step 4: Test Subscription Flow

#### Brand Subscription (Professional ₹299/mo)
1. Sign in as `brand-test@amcreator.com`
2. Navigate to `/pricing`
3. Click "Start Free Trial" on Professional plan
4. Should call `/api/payments/cashfree/create-subscription`
5. Redirects to Cashfree payment page
6. Pay with UPI: `testsuccess@okaxis`
7. Webhook hits `/api/payments/cashfree/webhook`
8. Subscription status updated in DB

#### Creator Pro Subscription (₹29/mo)
1. Sign in as `creator-pro@amcreator.com`
2. Navigate to `/pricing`
3. Click "Upgrade to Pro"
4. Complete payment
5. Verify Pro features unlocked (analytics, media kit)

#### Creator Elite Subscription (₹99/mo)
1. Sign in as `creator-elite@amcreator.com`
2. Navigate to `/pricing`
3. Click "Go Elite"
4. Complete payment
5. Verify Elite features (1:1 sessions, custom branding)

---

## API Endpoints to Test

### Create Subscription
```bash
POST /api/payments/cashfree/create-subscription
Body: {
  "planId": "plan_professional_123",
  "customerEmail": "brand-test@amcreator.com",
  "customerName": "TechCorp Inc.",
  "customerPhone": "9876543210"
}
Response: {
  "subscriptionId": "sub_...",
  "authLink": "https://payments.cashfree.com/subscription/..."
}
```

### Webhook Events (Simulate)
```bash
POST /api/payments/cashfree/webhook
Headers: { "x-cashfree-signature": "..." }
Body: {
  "event": "SUBSCRIPTION_AUTHORIZED",
  "subscription": { "subscriptionId": "sub_..." },
  "payment": { "paymentId": "pay_...", "status": "SUCCESS" }
}
```

---

## UI/UX Integration Points

### Pricing Page (`/pricing`)
- [ ] Show "Current Plan" badge for active subscriptions
- [ ] "Subscribe" button → Cashfree flow
- [ ] "Manage Subscription" link to Cashfree portal
- [ ] Cancel subscription confirmation modal

### Brand Dashboard (`/brands`)
- [ ] Show subscription status in header
- [ ] "Upgrade Plan" CTA for free/lower-tier users
- [ ] Usage limits based on plan (campaigns, creators invited)

### Creator Dashboard (`/creators`)
- [ ] Show Pro/Elite features unlocked
- [ ] "Upgrade" button for free users
- [ ] Media kit customization (Elite feature)

### Admin Dashboard (`/admin`)
- [ ] Revenue tracking (MRR, churn)
- [ ] Subscription list with filters
- [ ] Manual subscription management

---

## Test Scenarios Checklist

### Brand (Professional)
- [ ] Can create unlimited campaigns
- [ ] Can invite unlimited creators
- [ ] Has access to B2B pipeline
- [ ] Can export analytics (CSV, PDF)
- [ ] CRM integration available

### Creator Pro (₹29/mo)
- [ ] Enhanced analytics dashboard
- [ ] Public media kit
- [ ] Priority support (email)
- [ ] ROI tracking for campaigns

### Creator Elite (₹99/mo)
- [ ] All Pro features +
- [ ] 1:1 strategy session booking
- [ ] Custom media kit branding
- [ ] API access for data export
- [ ] Phone support

### Failure Scenarios
- [ ] Payment failure → Show error, allow retry
- [ ] Webhook signature invalid → Reject
- [ ] Subscription cancelled → Downgrade features
- [ ] Past due → Show warning, restrict access

---

## Database Schema Updates Needed

To fully track Cashfree subscriptions, add this model to `prisma/schema.prisma`:

```prisma
model Subscription {
  id                 String   @id @default(cuid())
  userId             String
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Cashfree fields
  cashfreeSubId      String   @unique  // Cashfree subscription ID
  cashfreeCustomerId String   // Cashfree customer ID
  planId             String   // Our internal plan ID
  planName           String   // "Professional", "Creator Pro", etc.
  
  // Status
  status             String   // "ACTIVE", "CANCELLED", "PAST_DUE"
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  
  // Billing
  amount             Decimal  @db.Decimal(10, 2)
  currency           String   @default("INR")
  interval           String   @default("MONTH")  // MONTH, YEAR
  
  // Timestamps
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  cancelledAt        DateTime?

  @@index([userId])
  @@index([cashfreeSubId])
  @@index([status])
}
```

Run migration:
```bash
npx prisma migrate dev --name add_subscription_model
```

---

## Monitoring & Debugging

### Check Logs
```bash
# Dev server logs
npm run dev

# Check webhook deliveries
# In Cashfree dashboard: Developers → Webhooks → Delivery Logs
```

### Common Issues
1. **Webhook not received:** Check endpoint is publicly accessible (use ngrok for local)
2. **Signature mismatch:** Ensure `CASHFREE_CLIENT_SECRET` matches exactly
3. **Plan not found:** Verify plan IDs in env match Cashfree dashboard

---

## Next Steps
1. Run seed script: `node prisma/seed-cashfree-test.js`
2. Create plans in Cashfree sandbox
3. Configure `.env.local` with credentials
4. Test each user flow end-to-end
5. Set up webhook endpoint (use ngrok if local)
6. Monitor webhook deliveries in Cashfree dashboard
