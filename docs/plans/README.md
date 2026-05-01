# AM Creator Analytics

> **Enterprise multi-tenant creator analytics platform** with Bloomberg × McKinsey design aesthetics.  
> Built with Next.js 16, Prisma, PostgreSQL, and 100% open-source stack.  
> **Estimated cost savings: ₹70K–1.9L/month** vs SaaS alternatives.

---

## ✨ Features

### 🔐 Core Features
- ✅ **Multi-Tenant Architecture** — Agency, Brand, Creator roles with tenant isolation
- ✅ **NextAuth Integration** — Role-based access (Super Admin, Agency, Brand, Creator)
- ✅ **Cashfree Payments** — Indian market focus (UPI Auto-pay support)
  - Brand Plan: ₹299/month
  - Creator Pro: ₹29/month
  - Creator Elite: ₹99/month

### 📄 OpenSign Integration (₹20K/month saved vs DocuSign)
- ✅ Contract creation API (`/api/contracts/create`)
- ✅ Webhook handler for signature events
- ✅ **Signing bonus automation** — ₹1,500 for creators with <50K followers
- ✅ Document templates & custom fields

### 📊 Dashboard & Analytics (Bloomberg × McKinsey Design)
- ✅ **Agency Command Center** — Multi-tenant overview, KPIs, charts
- ✅ **Brand Dashboard** — Campaign ROI, revenue trends
- ✅ **Creator Dashboard** — Earnings, growth tracking
- ✅ **Recharts Integration** — Revenue/margin trends, creator growth
- ✅ **Mobile-Responsive** — Breakpoints at 768px
- ✅ **Loading Skeletons** — Smooth loading states

### 🔄 Nango CRM Integration (₹40K–1.6L/month saved vs Merge.dev)
- ✅ Self-hosted Nango setup (Docker)
- ✅ HubSpot, Pipedrive, Salesforce sync
- ✅ Webhook handler for CRM events
- ✅ Auto-create leads from creators

### 💳 Stripe Connect Payouts
- ✅ Creator onboarding flow
- ✅ Send payouts (instant/standard)
- ✅ Transfer to connected accounts
- ✅ Webhook handler (payout/transfer status)
- ✅ Tested with ₹1,500 signing bonus

### 🔒 DPDPA Compliance (India's Data Protection Law)
- ✅ Consent management (give/withdraw)
- ✅ Data export API (Right to Data Portability)
- ✅ Data erasure API (Right to be Forgotten)
- ✅ Cookie consent banner
- ✅ Consent logs & audit trail

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- (Optional) Docker & Docker Compose

### 1. Clone & Install
```bash
git clone https://github.com/your-org/am-creator-analytics.git
cd am-creator-analytics
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your credentials:
# - DATABASE_URL (PostgreSQL connection)
# - NEXTAUTH_SECRET (32+ chars)
# - STRIPE_SECRET_KEY (for payouts)
# - OPENSIGN_API_KEY (for contracts)
# - NANGO_SECRET_KEY (for CRM sync)
```

### 3. Database Setup
```bash
# Push schema
npx prisma db push

# Or run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 4. Start Development Server
```bash
# Option A: Standard (with Turbopack - may have issues)
npm run dev

# Option B: Without Turbopack (stable)
npx next dev --no-turbopack

# Option C: Production build
npm run build
npm start
```

### 5. Access the App
- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/cmojiqbw80000h6f000mf7jkx/dashboard/admin
- **Brand Dashboard**: http://localhost:3000/cmojiqbw80000h6f000mf7jkx/dashboard/brand
- **Creator Dashboard**: http://localhost:3000/cmojiqbw80000h6f000mf7jkx/dashboard/creator

### 6. Test Credentials
| Role | Email | Password |
|------|--------|----------|
| Admin | `admin@amcreator.com` | `test123456` |
| Brand | `brand-test@amcreator.com` | `test123456` |
| Creator Pro | `creator-pro@amcreator.com` | `test123456` |
| Creator Elite | `creator-elite@amcreator.com` | `test123456` |

---

## 📂 Project Structure

```
am-creator-analytics/
├── app/
│   ├── [tenantId]/dashboard/
│   │   ├── admin/page.tsx          # Agency Command Center
│   │   ├── brand/page.tsx           # Brand Dashboard
│   │   ├── creator/page.tsx         # Creator Dashboard
│   │   ├── settings/page.tsx        # Settings (Stripe + DPDPA)
│   │   ├── campaigns/page.tsx       # Campaign Management
│   │   ├── contracts/page.tsx       # Contract Management
│   │   ├── analytics/page.tsx       # Analytics & Reports
│   │   ├── earnings/page.tsx        # Earnings & Payouts
│   │   └── layout.tsx             # Dashboard layout
│   ├── api/
│   │   ├── contracts/create/route.ts    # OpenSign contract creation
│   │   ├── webhooks/opensign/route.ts # OpenSign webhook
│   │   ├── stripe/connect/route.ts    # Stripe Connect onboarding
│   │   ├── stripe/payout/route.ts     # Creator payouts
│   │   ├── stripe/webhook/route.ts    # Stripe webhook
│   │   ├── nango/webhook/route.ts     # Nango CRM sync
│   │   ├── dpdpa/route.ts             # DPDPA compliance
│   │   └── dpdpa/export/route.ts      # User data export
│   └── ...
├── lib/
│   ├── opensign.ts              # OpenSign API client
│   ├── nango.ts                 # Nango API client
│   ├── stripe-connect.ts        # Stripe Connect client
│   └── prisma.ts                # Prisma client
├── components/
│   ├── dashboard/
│   │   ├── charts.tsx          # Recharts components
│   │   └── loading-skeleton.tsx # Loading states
│   ├── layout/
│   │   └── dashboard-sidebar.tsx # Sidebar navigation
│   └── dpdpa/
│       └── cookie-banner.tsx   # Cookie consent banner
├── prisma/
│   └── schema.prisma          # Database schema (482 lines)
├── docker-compose.yml         # Nango + PostgreSQL
├── DEPLOYMENT.md            # Production deployment guide
└── README.md                # This file
```

---

## 💰 Cost Savings (Open-Source Preference)

Per user preference: **Always evaluate open-source/self-hosted alternatives BEFORE recommending paid SaaS tools.**

| Tool | Open-Source Alternative | Savings/month |
|------|----------------------|---------------|
| Merge.dev (CRM sync) | **Nango (self-hosted)** | ₹40K–1.6L |
| DocuSign (contracts) | **OpenSign (self-hosted)** | ₹20K |
| Mongo Atlas (database) | **PostgreSQL** | ₹10K |
| Zapier (automation) | **n8n (self-hosted)** | ₹10K |
| **Total** | | **₹80K–2L/month** |

---

## 🧪 Testing

### Test OpenSign Integration
```bash
# Create a test contract
curl -X POST http://localhost:3000/api/contracts/create \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "cmojkg68p000114gjh1q9aq1u",
    "creatorId": "cmoj4737f0007yv94v3zzegry",
    "amount": 50000,
    "currency": "INR"
  }'
```

### Test Stripe Connect
```bash
# Run test script (₹1,500 signing bonus)
node scripts/test-stripe-connect.js
```

### Test Nango Sync
```bash
# Start Nango
docker-compose up nango

# Access Nango UI
open http://localhost:3004
```

---

## 📊 Tech Stack

### Frontend
- **Next.js 16** (App Router, Server Components)
- **TypeScript** (strict mode)
- **Tailwind CSS** (Bloomberg × McKinsey design)
- **Recharts** (Revenue/margin trends, creator growth)
- **Lucide React** (Icons)

### Backend
- **Next.js API Routes** (Route Handlers)
- **Prisma ORM** (PostgreSQL)
- **NextAuth** (Authentication & authorization)

### Integrations
- **OpenSign** (Contract management)
- **Nango** (CRM sync — HubSpot, Pipedrive, Salesforce)
- **Stripe Connect** (Creator payouts)
- **Cashfree** (Indian payments — UPI Auto-pay)
- **Resend** (Email notifications)

### DevOps
- **Docker** (Nango, PostgreSQL)
- **Vercel** (Frontend hosting)
- **Railway / DigitalOcean** (Backend hosting)
- **Sentry** (Error monitoring)

---

## 🔒 DPDPA Compliance

India's Digital Personal Data Protection Act (DPDPA) 2023 compliance:

- ✅ **Consent Management** — Give/withdraw consent anytime
- ✅ **Data Export** — JSON export of all user data
- ✅ **Data Erasure** — "Right to be Forgotten" flow
- ✅ **Cookie Consent Banner** — GDPR-style banner
- ✅ **Consent Logs** — Audit trail of all consent changes
- ✅ **Data Localization** — Indian user data stored in India

---

## 📝 Work Log

See [WORKLOG.md](./WORKLOG.md) for detailed progress tracking.

### Today's Commits (2026-04-29):
1. `1a5c15a` — Update sidebar with Bloomberg design, integrate Recharts
2. `6d9d37b` — Update Brand & Creator dashboards with Recharts and API connections
3. `362dbea` — Add loading states, mobile-responsive design to all dashboards
4. `b49d4c8` — Add Stripe Connect test script for ₹1,500 bonus payout
5. `75b5de4` — Update Settings page with Stripe Connect onboarding UI
6. `5f65e81` — Add DPDPA Compliance features for Indian market

---

## 🆘 Support

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [OpenSign Docs](https://docs.opensign.com)
- [Nango Docs](https://docs.nango.dev)
- [Stripe Connect](https://stripe.com/docs/connect)

### Community
- [GitHub Issues](https://github.com/your-org/am-creator-analytics/issues)
- [Discord Community](https://discord.gg/your-server)

---

## 📄 License

MIT License — feel free to use this project for your own SaaS.

---

**Built with ❤️ by the AM Creator Analytics team.**
