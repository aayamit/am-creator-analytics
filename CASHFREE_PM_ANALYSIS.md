# Cashfree Integration - PM Analysis

## Executive Summary

**Objective:** Integrate Cashfree Payments for Indian market subscription billing while retaining Stripe for creator payouts.

**Why Cashfree?**
- ✅ **UPI Auto-pay** support (critical for Indian market)
- ✅ **Lower pricing** vs Stripe India (2% vs 3%+)
- ✅ **Local compliance** (RBI regulations, DPDP Act)
- ✅ **Better UX** for Indian users (UPI, NetBanking, Paytm)

**Integration Strategy:**
```
Brand/Creator Subscriptions → Cashfree (INR billing)
Creator Payouts → Stripe Connect (USD/INR)
Admin Revenue → Track both via Prisma Subscription model
```

---

## 1. Product Strategy

### Target Market Analysis
| Segment | Plan | Price | Target Users | Market Size |
|---------|------|-------|--------------|-------------|
| Brands | Professional | ₹299/mo | D2C brands, SaaS companies | 10K+ in India |
| Creators | Pro | ₹29/mo | Mid-tier (50K-500K followers) | 100K+ in India |
| Creators | Elite | ₹99/mo | Top-tier (500K+ followers) | 10K+ in India |

### Competitive Advantage
- **Stripe-only competitors** (e.g., Kofluence, Qoruz) have higher friction for Indian users
- **UPI Auto-pay** reduces churn by 30% (industry benchmark)
- **Dual-currency support** (INR subscriptions, USD payouts) = best of both worlds

---

## 2. Integration Architecture

### Payment Flow Diagram
```
User clicks "Subscribe" 
    ↓
/api/payments/cashfree/create-subscription
    ↓
Cashfree Auth Link (UPI/NetBanking/Card)
    ↓
User completes payment
    ↓
Cashfree webhook → /api/payments/cashfree/webhook
    ↓
Update Prisma Subscription model
    ↓
User gets access to plan features
```

### Data Model
```prisma
User {
  subscriptions: Subscription[]  // One user can have multiple (historical)
}

Subscription {
  userId → User
  cashfreeSubId: String        // "sub_123..."
  cashfreeCustomerId: String    // "customer_456..."
  planTier: "professional" | "creator_pro" | "creator_elite"
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE"
  amount: Decimal              // ₹299, ₹29, ₹99
  currentPeriodEnd: DateTime   // When to renew
}
```

---

## 3. UI/UX Changes Required

### 3.1 Pricing Page (`/pricing`)

**Current State:**
- Static pricing cards
- Buttons link to `/api/auth/signin`

**Required Changes:**
```tsx
// Show current plan badge
{userSubscription?.planTier === 'professional' && (
  <Badge>Current Plan</Badge>
)}

// Subscribe button → Cashfree flow
<Button onClick={() => createCashfreeSubscription(planId)}>
  {isCurrentPlan ? 'Manage Subscription' : 'Start Free Trial'}
</Button>

// Show features by plan tier
{plan.tier === 'creator_elite' && (
  <div className="elite-features">
    ✨ 1:1 Strategy Session
    ✨ Custom Media Kit Branding
    ✨ API Access
  </div>
)}
```

**Design Notes (Bloomberg × McKinsey Style):**
- Use `JetBrains Mono` for price amounts (₹299/mo)
- Minimalist cards with subtle `box-shadow` on hover
- "Most Popular" badge: `overflow-visible` (already fixed)
- CTA buttons: White with `#92400e` accent border, no arrows

---

### 3.2 Brand Dashboard (`/brands`)

**New Components:**

1. **Subscription Status Card**
```tsx
<div className="subscription-status">
  <h3>Professional Plan</h3>
  <p>₹299/month • Next billing: May 1, 2026</p>
  <Button variant="outline">Manage Billing</Button>
</div>
```

2. **Usage Limits (Based on Plan)**
```tsx
const PLAN_LIMITS = {
  free: { campaigns: 1, creatorsPerCampaign: 5 },
  professional: { campaigns: 'unlimited', creatorsPerCampaign: 'unlimited' },
};

// Show limit warnings
{campaigns.length >= PLAN_LIMITS[userPlan].campaigns && (
  <Alert>Upgrade to Professional for unlimited campaigns</Alert>
)}
```

3. **Upgrade CTA (For Free Users)**
```tsx
{userPlan === 'free' && (
  <div className="upgrade-banner">
    <p>🚀 Upgrade to Professional</p>
    <p>Unlimited campaigns • B2B Pipeline • CRM Integration</p>
    <Button href="/pricing">Upgrade Now</Button>
  </div>
)}
```

---

### 3.3 Creator Dashboard (`/creators`)

**New Components:**

1. **Plan Features Unlocked**
```tsx
// Creator Pro Features
{userPlan === 'creator_pro' || userPlan === 'creator_elite' && (
  <>
    <AnalyticsDashboard />  // Enhanced analytics
    <MediaKitPublic />     // Public media kit
    <ROIReporting />       // Campaign ROI
  </>
)}

// Creator Elite Features
{userPlan === 'creator_elite' && (
  <>
    <StrategySessionBooking />  // 1:1 sessions
    <CustomBranding />         // Media kit customization
    <APIAccess />              // Data export API
  </>
)}
```

2. **Upgrade Prompts**
```tsx
// Show on free tier
{userPlan === 'free' && (
  <Card className="upgrade-prompt">
    <h4>Unlock Pro Features</h4>
    <ul>
      <li>✅ Public Media Kit</li>
      <li>✅ Advanced Analytics</li>
      <li>✅ Priority Support</li>
    </ul>
    <Button href="/pricing">Upgrade for ₹29/mo</Button>
  </Card>
)}
```

---

### 3.4 Admin Dashboard (`/admin`)

**New Section: Subscription Management**

```tsx
// Revenue Tracking
<div className="revenue-metrics">
  <MetricCard title="MRR" value="₹1,45,000" />
  <MetricCard title="Churn Rate" value="3.2%" />
  <MetricCard title="Active Subscriptions" value="523" />
</div>

// Subscription List
<Table>
  <TableHeader>
    <TableCell>User</TableCell>
    <TableCell>Plan</TableCell>
    <TableCell>Status</TableCell>
    <TableCell>Next Billing</TableCell>
    <TableCell>Actions</TableCell>
  </TableHeader>
  {/* Rows: subscription data */}
</Table>
```

---

## 4. Success Metrics (KPIs)

### Primary Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| **MRR (Monthly Recurring Revenue)** | ₹5L by Month 3 | Prisma Subscription model |
| **Conversion Rate** (Free → Paid) | 15% | Google Analytics + DB |
| **Churn Rate** | <5% monthly | Cashfree webhook data |
| **Payment Success Rate** | >95% | Cashfree API response |

### Secondary Metrics
- **UPI vs Card usage:** Target 70% UPI (Indian market preference)
- **Average Revenue Per User (ARPU):** ₹350 (mixed plans)
- **Support tickets related to billing:** <2% of total

---

## 5. Risks & Mitigation

### Risk 1: Webhook Failures
**Impact:** Subscription status out of sync  
**Mitigation:**
- Implement webhook signature verification
- Store webhook events in `ComplianceAudit` model
- Add retry logic for failed webhooks
- Admin dashboard to manually sync subscriptions

### Risk 2: UPI Auto-pay Mandate Failure
**Impact:** Payment failures, churn  
**Mitigation:**
- Fallback to one-time payments (NetBanking/Card)
- Email reminders 3 days before mandate expiry
- "Update Payment Method" flow in dashboard

### Risk 3: Currency Mismatch (INR vs USD)
**Impact:** Confusion for international users  
**Mitigation:**
- Brands/Creators in India → Cashfree (INR)
- International users → Stripe (USD) (future)
- Clear "Billed in INR" messaging on pricing page

### Risk 4: Compliance (RBI, DPDP Act)
**Impact:** Legal issues  
**Mitigation:**
- Store payment data in India (already using PostgreSQL)
- Implement ₹1 tokenization for cards (Cashfree handles this)
- Add GDPR/DPDP consent checkboxes on signup
- Audit logs in `ComplianceAudit` model

---

## 6. Implementation Checklist

### Phase 1: Backend (Week 1)
- [x] Add Subscription model to Prisma
- [x] Create `/api/payments/cashfree/create-subscription` endpoint
- [x] Create `/api/payments/cashfree/webhook` endpoint
- [ ] Add webhook signature verification
- [ ] Create Prisma seed script with mock profiles
- [ ] Test webhook events in Cashfree sandbox

### Phase 2: Frontend (Week 2)
- [ ] Update `/pricing` page with Cashfree flow
- [ ] Add subscription status to Brand/Creator dashboards
- [ ] Create "Manage Subscription" page (cancel, update payment)
- [ ] Add upgrade CTAs for free users
- [ ] Show plan-specific features (gated by `userSubscription.planTier`)

### Phase 3: Admin (Week 3)
- [ ] Build admin subscription management page
- [ ] Add revenue tracking (MRR, churn)
- [ ] Create manual sync tool for failed webhooks
- [ ] Add subscription export (CSV)

### Phase 4: Testing & Launch (Week 4)
- [ ] End-to-end testing with mock profiles
- [ ] Load testing (100 concurrent subscriptions)
- [ ] UAT with 5 beta users
- [ ] Production deployment (switch to `CASHFREE_ENV=production`)
- [ ] KYC verification with Cashfree

---

## 7. Mock Profiles for Testing

Created via `prisma/seed-cashfree-test.js`:

| Role | Email | Password | Plan | Use Case |
|------|-------|----------|------|----------|
| Admin | `admin@amcreator.com` | `test123456` | None | Monitor subscriptions |
| Brand | `brand-test@amcreator.com` | `test123456` | Professional (₹299/mo) | Test brand flow |
| Creator Pro | `creator-pro@amcreator.com` | `test123456` | Creator Pro (₹29/mo) | Test creator flow |
| Creator Elite | `creator-elite@amcreator.com` | `test123456` | Creator Elite (₹99/mo) | Test premium features |

**Test Scenarios:**
1. Sign in as Brand → Subscribe to Professional → Create campaign
2. Sign in as Creator Pro → View analytics → Receive campaign invite
3. Sign in as Creator Elite → Book strategy session → Customize media kit

---

## 8. Next Steps

1. **Immediate (This Week):**
   - Update pricing page buttons to call Cashfree API
   - Add subscription status check to layouts (show "Upgrade" CTA)
   - Test webhook flow with ngrok (local) or staging

2. **Short Term (Next 2 Weeks):**
   - Build "Manage Subscription" page
   - Add plan-gating to features (Pro/Elite)
   - Create admin revenue dashboard

3. **Long Term (Next Month):**
   - International payment support (Stripe for non-India)
   - Annual billing discounts (save 20%)
   - Referral program (₹100 off for referrals)

---

**Document Version:** 1.0  
**Last Updated:** April 28, 2026  
**Owner:** Product Team  
**Status:** Ready for Development
