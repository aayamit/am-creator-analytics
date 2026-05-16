# AM Creator Analytics — Agent Handover Document

**Version:** 1.1  
**Date:** 2026-05-16  
**Prepared by:** OWL (Hermes Agent) + Codex  
**Project Owner:** Amit Kumar (amitkumaraman)

---

## 1. Project Overview

AM Creator Analytics is a **B2B SaaS platform** for influencer marketing management. It connects brands with creators, manages campaigns, tracks ROI, handles contracts (via OpenSign), processes payouts (via Stripe), and integrates with social platforms (Instagram, YouTube, LinkedIn). It also includes CRM sync via Nango (Salesforce/HubSpot).

**Tagline:** *"Stop measuring vanity metrics. Start tracking real B2B business outcomes."*

**Domain:** `amcreatoranalytics.com` (purchased via Squarespace/Google Workspace)  
**Email:** `partnerships@amcreatoranalytics.com`

---

## Current Status

- Public preview is intended to run directly from the Mac Mini through Docker + Cloudflare Tunnel.
- The site returned Cloudflare `502` after the Mac restart because the local Docker stack was down even though the tunnel connector was still active.
- Docker was brought back and the named Cloudflare tunnel connector was confirmed active again on 2026-05-16.
- The production app image then failed a rebuild due to a JSX syntax error in `app/marketing/page.tsx`; that fix is now part of the clean sync path.
- The app container is now healthy again on the Mac and both `http://127.0.0.1:3000` and `https://amcreatoranalytics.com` respond successfully.
- Recovery used a local-only compose override to point the app at the correct app database and then ran `prisma db push` to create the missing tables. That override file should stay local and should not be committed.
- The local repository on `/Volumes/DA/am-creator-analytics` has a local-only commit (`1ade516`) that accidentally includes `volumes/` runtime data and `.env.backup`. Do **not** push that commit directly.
- The correct GitHub repository is `https://github.com/aayamit/am-creator-analytics.git`. The stale `amitkumaraman/...` URL in the old handover notes is wrong.

---

## 2. File Locations & Project Structure

### Primary Project Directory
```
/Volumes/DA/am-creator-analytics/
```

### Key Files & Directories

| Path | Purpose |
|------|---------|
| `/Volumes/DA/am-creator-analytics/` | Project root |
| `app/` | Next.js App Router — all pages & API routes |
| `app/api/` | 60+ API routes (see §8) |
| `app/[tenantId]/dashboard/` | Tenant-scoped dashboard pages |
| `app/marketing/` | Landing page routes (layout.tsx wraps marketing pages) |
| `app/(auth)/` | Login/signup pages |
| `app/layout.tsx` | Root layout (ThemeProvider + AuthProviders) |
| `components/` | Shared React components (NavBar, Footer, providers) |
| `lib/` | Service clients & utilities (Prisma, Redis, MinIO, Nango, OpenSign, Stripe) |
| `prisma/schema.prisma` | Database schema (PostgreSQL) |
| `prisma/seed.js` | Database seed script |
| `docker-compose.prod.yml` | Production Docker orchestration |
| `docker-compose.yml` | Development Docker orchestration |
| `Dockerfile.prod` | Production Docker image (multi-stage, node:20-slim) |
| `Dockerfile` | Development Docker image (node:20-alpine) |
| `nginx/conf/default.conf` | Nginx reverse proxy config |
| `nginx/ssl/` | Self-signed SSL certificates |
| `.env.prod` | Production environment variables |
| `.env` | Local environment variables |
| `volumes/postgres/` | PostgreSQL data (persistent) |
| `volumes/mongo/` | MongoDB data (for OpenSign) |
| `volumes/redis/` | Redis data (persistent) |
| `AM_Creator_Analytics_Docker_Context.md` | Docker deployment reference |
| `WORK_LOG.md` | Development work log |
| `vercel.json` | Vercel deployment config |

### User's Local Workspace (secondary)
```
/Users/amit/workspace/
```

---

## 3. Git & Repository Details

### Repository
- **Correct URL:** `https://github.com/aayamit/am-creator-analytics.git`
- **Branch:** `master`
- **Remote:** `origin`
- **Current problem:** local repo `origin` may still point at the stale `amitkumaraman/am-creator-analytics` URL on disk; update it before pushing from the live repo
- **Push warning:** do not push local commit `1ade516` directly because it contains `volumes/` database/runtime files and `.env.backup`

### Recent Commits
```
1ade516  Phase 3: B2B SaaS landing, auth flows, interactive ROI calculator
9f7f68f  fix(auth): complete UI unification for login/signup pages
5f06013  fix: unify signup UI with login page, fix Nango image in docker-compose
a456163  feat: Improve login page UI with Bloomberg McKinsey styling
1b07573  feat: Add Instagram integration + fix landing page UI
8b9d173  docs: update WORK_LOG with correct GitHub repo URL
02e7b26  test: complete OpenSign integration testing
dee2ea0  chore: Remove backup files, test dirs, chrome-extension
48e0cbd  chore: Clean up - move plan docs to docs/plans/
5930ef5  feat: Add Docker production deployment files
```

### Git Commands
```bash
cd /Volumes/DA/am-creator-analytics
git status
git log --oneline -10
git push origin master
```

---

## 4. Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15.5.15 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19.2.4, Tailwind CSS 4, shadcn/ui 4.5 |
| **Auth** | NextAuth 4.24.14 (Prisma adapter) |
| **Database** | PostgreSQL 16 (via Prisma ORM 5.22.0) |
| **Cache** | Redis (ioredis) |
| **Storage** | MinIO (S3-compatible, self-hosted) |
| **Payments** | Stripe Connect (test mode) |
| **Contracts** | OpenSign (self-hosted, Parse Server API) |
| **CRM Sync** | Nango (self-hosted, Salesforce/HubSpot) |
| **Search** | MeiliSearch (self-hosted) |
| **Email** | Resend |
| **Payments (India)** | Razorpay |
| **Theme** | next-themes (light/dark, default: light) |
| **Charts** | recharts 3.8.1 |
| **PDF** | jspdf, pdfkit |
| **PPTX** | pptxgenjs |
| **Excel** | exceljs |
| **3D** | three.js + @react-three/fiber |
| **WebSockets** | ws |
| **MQTT** | mqtt |
| **Testing** | Jest 30, Testing Library |
| **Linting** | ESLint 9 |
| **Reverse Proxy** | Nginx (alpine) |
| **Tunnel** | Cloudflare Quick Tunnel |
| **Containerization** | Docker Compose 3.8 |

---

## 5. Docker & Deployment

### Production Stack (docker-compose.prod.yml)

| Service | Container Name | Image | Host Port | Container Port |
|---------|---------------|-------|-----------|----------------|
| App (Next.js) | `am-creator-app` | Built from `Dockerfile.prod` | 3000 | 3000 |
| Nginx | `am-creator-nginx` | `nginx:alpine` | 80, 443 | 80, 443 |
| PostgreSQL | `am-creator-postgres` | `postgres:16-alpine` | 5432 | 5432 |
| Redis | `am-creator-redis` | `redis:alpine` | 6379 | 6379 |
| Nango | `am-creator-nango` | `nangohq/nango-server:hosted` | 3005, 3006 | 3000, 3006 |
| OpenSign | `opensign-client` | `opensign/opensign:main` | 3001 | 3000 |
| MongoDB | `opensign-mongo` | `mongo:latest` | 27017 | 27017 |

All services on Docker network: `app-network` (bridge)

### Development Stack (docker-compose.yml)
- PostgreSQL, Nango, MinIO, MeiliSearch, Redis
- No app container — run `npm run dev` locally

### Production Build & Start
```bash
cd /Volumes/DA/am-creator-analytics

# Build app image
docker compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache app

# Start all services
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop all
docker compose -f docker-compose.prod.yml down
```

### Important Docker Notes
- **Build requires:** `NEXT_LINT_DISABLED=true` (TypeScript errors are ignored in build)
- **Build context should exclude:** `volumes/` so Docker does not send local database state into the image build context
- **If homepage works but auth/database routes fail:** rebuild the `app` image and check `docker compose ... logs app` for Prisma/OpenSSL errors
- **Nango DB setup:** Must create `nango` user/database in Postgres:
  ```sql
  CREATE USER nango WITH PASSWORD 'nango';
  CREATE DATABASE nango OWNER nango;
  GRANT ALL PRIVILEGES ON DATABASE nango TO nango;
  ```
- **Nginx** proxies to container name `am-creator-app:3000` (not localhost)
- **SSL certs** are self-signed at `nginx/ssl/cert.pem` and `nginx/ssl/key.pem`
- **Persistent data** in `/Volumes/DA/am-creator-analytics/volumes/`

### Nginx Virtual Hosts
| Domain | Proxies To |
|--------|-----------|
| `amcreatoranalytics.com` | `am-creator-app:3000` (landing + app) |
| `app.amcreatoranalytics.com` | `am-creator-app:3000` (dashboard) |
| `opensign.amcreatoranalytics.com` | `opensign-client:3000` |

---

## 6. Cloudflare Tunnel

- **Active named tunnel on 2026-05-16:** `amcamacmini`
- **Active tunnel ID on 2026-05-16:** `d0736635-75f1-482c-a672-b31451c86ff6`
- **Origin target:** `http://127.0.0.1:3000`
- **Public domain:** `amcreatoranalytics.com`
- **Note:** the older `6aaf5b9c-77de-4be9-83f0-60964b3a564c` value still appears in local env/docs, but the active connector observed during recovery was the `amcamacmini` named tunnel above

---

## 7. Environment Variables

All values below should stay sanitized in documentation. Real secrets live only in local `.env` and `.env.prod`.

### Production (.env.prod)
```env
# App Core
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://amcreatoranalytics.com
NEXT_PUBLIC_APP_URL=https://amcreatoranalytics.com

# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/nango?schema=public"

# Instagram (Meta App)
INSTAGRAM_CLIENT_ID=<configured locally>
INSTAGRAM_CLIENT_SECRET=<configured locally>
INSTAGRAM_REDIRECT_URI=https://amcreatoranalytics.com/api/instagram/callback

# YouTube (Google Cloud) — PLACEHOLDER, needs real credentials
YOUTUBE_CLIENT_ID=your_youtube_client_id_here
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret_here
YOUTUBE_REDIRECT_URI=https://amcreatoranalytics.com/api/youtube/callback

# LinkedIn — PLACEHOLDER, needs real credentials
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
LINKEDIN_REDIRECT_URI=https://amcreatoranalytics.com/api/linkedin/callback

# Stripe — PLACEHOLDER test keys
STRIPE_SECRET_KEY=sk_test_placeholder_key_for_build
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key_for_build
STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_build

# App
PORT=3000
CLOUDFLARE_TUNNEL_ID=6aaf5b9c-77de-4be9-83f0-60964b3a564c
POSTGRES_PASSWORD=postgres

# Nango
NANGO_SECRET_KEY=<configured locally>
NANGO_ENCRYPTION_KEY=<configured locally>
NANGO_ADMIN_KEY=<configured locally>
```

### Local Development (.env)
```env
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://amcreatoranalytics.com
NEXT_PUBLIC_APP_URL=https://amcreatoranalytics.com
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/am_creator_analytics"
INSTAGRAM_CLIENT_ID=<configured locally>
INSTAGRAM_CLIENT_SECRET=<configured locally>
INSTAGRAM_REDIRECT_URI=https://amcreatoranalytics.com/api/instagram/callback
YOUTUBE_CLIENT_ID=your_youtube_client_id_here
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret_here
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
STRIPE_SECRET_KEY=sk_test_placeholder_key_for_build
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key_for_build
STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_build
PORT=3000
CLOUDFLARE_TUNNEL_ID=6aaf5b9c-77de-4be9-83f0-60964b3a564c
POSTGRES_PASSWORD=postgres
NANGO_SECRET_KEY=<configured locally>
NANGO_ENCRYPTION_KEY=<configured locally>
NANGO_ADMIN_KEY=<configured locally>
```

### Required from Developer Portals (NOT YET CONFIGURED)
- **YouTube:** Create project at [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 credentials
- **LinkedIn:** Create app at [LinkedIn Developers](https://www.linkedin.com/developers/) → OAuth 2.0 credentials
- **Stripe:** Get live keys from [Stripe Dashboard](https://dashboard.stripe.com/)
- **Resend:** Get API key from [Resend](https://resend.com/)
- **Razorpay:** Get keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)

---

## 8. API Routes Reference

### Auth
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `app/api/auth/2fa/setup/route.ts` — 2FA setup
- `app/api/auth/2fa/enable/route.ts` — Enable 2FA
- `app/api/auth/2fa/verify/route.ts` — Verify 2FA
- `app/api/demo-login/route.ts` — Demo login
- `app/api/test-login/route.ts` — Test login

### Social Media OAuth
- `app/api/instagram/auth/route.ts` — Instagram OAuth initiation
- `app/api/instagram/callback/route.ts` — Instagram OAuth callback
- `app/api/youtube/auth/route.ts` — YouTube OAuth initiation
- `app/api/youtube/callback/route.ts` — YouTube OAuth callback
- `app/api/linkedin/auth/route.ts` — LinkedIn OAuth initiation
- `app/api/linkedin/callback/route.ts` — LinkedIn OAuth callback
- `app/api/social-accounts/[platform]/route.ts` — Social account management

### Campaigns & Creators
- `app/api/campaigns/[id]/route.ts` — Campaign CRUD
- `app/api/campaigns/[id]/ab-tests/route.ts` — A/B testing
- `app/api/creators/route.ts` — Creator listing
- `app/api/creators/[id]/route.ts` — Creator profile
- `app/api/creators/[id]/analytics/route.ts` — Creator analytics
- `app/api/creators/[id]/verify/route.ts` — Creator verification

### Contracts & Payments
- `app/api/contracts/create/route.ts` — Create contract via OpenSign
- `app/api/webhooks/opensign/route.ts` — OpenSign webhook (signing bonus logic)
- `app/api/stripe/connect/route.ts` — Stripe Connect onboarding
- `app/api/stripe/payout/route.ts` — Payout processing
- `app/api/stripe/webhook/route.ts` — Stripe webhook handler
- `app/api/payments/upi-qr/route.ts` — UPI QR payments

### CRM (Nango)
- `app/api/crm/connect/route.ts` — Initiate CRM connection
- `app/api/crm/callback/route.ts` — CRM OAuth callback
- `app/api/crm/connections/route.ts` — List CRM connections
- `app/api/crm/sync/route.ts` — Trigger CRM sync
- `app/api/nango/webhook/route.ts` — Nango webhook

### Leads & Analytics
- `app/api/leads/route.ts` — Lead management
- `app/api/leads/[id]/route.ts` — Lead details
- `app/api/track/conversion/route.ts` — Conversion tracking
- `app/api/brands/analytics/roi/route.ts` — ROI analytics
- `app/api/optimize/budget/route.ts` — Budget optimization

### Admin
- `app/api/admin/audit-logs/route.ts` — Audit logs
- `app/api/admin/gdpr/route.ts` — GDPR compliance
- `app/api/admin/users/route.ts` — User management

### Reports & Export
- `app/api/reports/csv/route.ts` — CSV export
- `app/api/reports/excel/route.ts` — Excel export
- `app/api/reports/powerbi/route.ts` — Power BI export
- `app/api/export/pitch-deck/route.ts` — Pitch deck export
- `app/api/invoices/generate/route.ts` — GST invoice generation

### ML & AI
- `app/api/ml/churn-predict/route.ts` — Churn prediction
- `app/api/ml/ltv-predict/route.ts` — LTV prediction
- `app/api/ai/recommend-creators/route.ts` — Creator recommendation

### Other
- `app/api/health/route.ts` — Health check (DB + API status)
- `app/api/upload/route.ts` — File upload (MinIO)
- `app/api/notifications/route.ts` — Notifications
- `app/api/mobile/register-push-token/route.ts` — Push token registration
- `app/api/mobile/send-push/route.ts` — Push notification sending
- `app/api/dpdpa/route.ts` — DPDP Act compliance (India)
- `app/api/developer/keys/route.ts` — API key management

---

## 9. Database Schema (Prisma)

**File:** `prisma/schema.prisma`  
**Database:** PostgreSQL  
**Connection:** Via `DATABASE_URL` env var  
**Client:** `lib/prisma.ts` — singleton PrismaClient

### Core Models

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | All users (creators, brands, admins) | id, email, role (UserRole), tenantId |
| **Account** | NextAuth OAuth accounts | userId, provider, providerAccountId |
| **Session** | NextAuth sessions | userId, sessionToken, expires |
| **Tenant** | Multi-tenant organizations | name, type (AGENCY/BRAND) |
| **CreatorProfile** | Creator-specific data | userId, displayName, niche, followerCount, engagementRate, gstin, panNumber |
| **BrandProfile** | Brand-specific data | userId, companyName, industry, website |
| **Campaign** | Marketing campaigns | brandId, title, budget, status (DRAFT/ACTIVE/PAUSED/COMPLETED/CANCELLED) |
| **CampaignCreator** | Creator assignment to campaign | campaignId, creatorId, rate, paymentStatus |
| **CampaignInvite** | Invitation to creator | campaignId, creatorId, status |
| **Contract** | Legal contracts | campaignCreatorId, status, openSignDocumentId, openSignUrl, signedAt, bonusAmount |
| **Lead** | B2B leads from campaigns | campaignId, creatorId, email, stage (MQL/SQL/OPPORTUNITY/CLOSED_WON/CLOSED_LOST) |
| **TrackingEvent** | Lead tracking events | leadId, campaignId, type, timestamp |
| **SocialAccount** | Connected social platforms | creatorId, platform (YOUTUBE/LINKEDIN/INSTAGRAM/TIKTOK), accessToken, refreshToken, isConnected |
| **PayoutAccount** | Creator payout accounts | creatorId, provider (STRIPE/RAZORPAY/CASHFREE/WIRE/UPI) |
| **PayoutTransaction** | Payout records | payoutAccountId, amount, status |
| **AuthenticityAudit** | Creator authenticity scoring | creatorId, score |
| **creator_verification** | KYC verification | creatorId, idType, idNumber, bankName, accountNumber, ifscCode, upiId |
| **payment_methods** | Creator payment methods | creatorId, type (UPI/BANK_TRANSFER/RAZORPAY) |
| **SupportTicket** | Support tickets | subject, description, status, priority |
| **Notification** | User notifications | userId, type, title, message |
| **push_tokens** | Mobile push tokens | userId, token, platform, deviceId |
| **campaign_templates** | Reusable campaign templates | name, category, budget, duration, requirements |

### Enums
- `CampaignStatus`: DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED
- `ContractStatus`: DRAFT, SENT, SIGNED_BY_CREATOR, SIGNED_BY_BRAND, FULLY_EXECUTED, EXPIRED, TERMINATED
- `LeadStage`: MQL, SQL, OPPORTUNITY, CLOSED_WON, CLOSED_LOST
- `SocialPlatform`: YOUTUBE, LINKEDIN, INSTAGRAM, TIKTOK
- `PaymentProvider`: STRIPE, RAZORPAY, CASHFREE, WIRE_TRANSFER, UPI
- `UserRole`: CREATOR, BRAND, ADMIN
- `TenantType`: AGENCY, BRAND

### Key SQL Migration
File: `add_social_columns.sql` — Adds OAuth columns to SocialAccount table.

---

## 10. Key Library Modules

| File | Purpose |
|------|---------|
| `lib/prisma.ts` | PrismaClient singleton |
| `lib/nango-client.ts` | Nango API client (connections, sync, passthrough) |
| `lib/nango.ts` | Nango frontend SDK wrapper |
| `lib/opensign.ts` | OpenSign API client (create/send/cancel documents) |
| `lib/stripe-connect.ts` | Stripe Connect (accounts, payouts, transfers, webhooks) |
| `lib/redis.ts` | Redis client with cache wrapper (cache/invalidateCache/clearCache) |
| `lib/minio.ts` | MinIO S3 client (upload/list/delete files) |
| `lib/email.ts` | Email utilities |
| `lib/notification.ts` | Notification creation |
| `lib/notification-events.ts` | Notification event types |
| `lib/roi-prediction.ts` | ROI prediction logic |
| `lib/gst-invoice.ts` | GST invoice generation |
| `lib/pdf-export.ts` | PDF export |
| `lib/pptx-export.ts` | PowerPoint export |
| `lib/rate-limit.ts` | Rate limiting |
| `lib/with-rate-limit.ts` | Rate limit middleware |
| `lib/self-healing.ts` | Self-healing logic |
| `lib/quantum-optimization.ts` | Budget optimization |
| `lib/time-travel.ts` | Time-travel debugging |
| `lib/warp-drive.ts` | Warp drive feature |
| `lib/bci-service.ts` | BCI (Brain-Computer Interface) service |
| `lib/iot-service.ts` | IoT service |
| `lib/websocket-server.ts` | WebSocket server |
| `lib/web-vitals.ts` | Web vitals monitoring |
| `lib/image-optimization.ts` | Image optimization |
| `lib/design-tokens.ts` | Design system tokens |
| `lib/utils.ts` | General utilities |

---

## 11. Application Routes (Frontend)

### Marketing Pages (public)
- `/` — Landing page
- `/features` — Features page
- `/pricing` — Pricing page
- `/about` — About page
- `/contact` — Contact page
- `/privacy` — Privacy policy
- `/terms` — Terms of service
- `/how-it-works` — How it works
- `/problem` — Problem statement
- `/solution` — Solution page
- `/market-opportunity` — Market opportunity

### Auth Pages
- `/login` — Login page (Bloomberg McKinsey executive style)
- `/signup` — Signup page (matches login UI)

### Dashboard (tenant-scoped: `/[tenantId]/dashboard/`)
- `/dashboard` — Main dashboard
- `/dashboard/creator` — Creator dashboard
- `/dashboard/brand` — Brand dashboard
- `/dashboard/analytics` — Analytics
- `/dashboard/campaigns` — Campaign list
- `/dashboard/campaigns/[id]` — Campaign detail
- `/dashboard/campaigns/new` — Create campaign
- `/dashboard/contracts` — Contract list
- `/dashboard/contracts/[id]` — Contract detail
- `/dashboard/earnings` — Earnings
- `/dashboard/payouts` — Payouts
- `/dashboard/crm` — CRM connections
- `/dashboard/connections` — Social connections
- `/dashboard/media-kit` — Media kit
- `/dashboard/settings` — Settings
- `/dashboard/admin` — Admin panel
- `/dashboard/admin/audit-logs` — Audit logs
- `/dashboard/admin/gdpr` — GDPR compliance
- `/dashboard/admin/users` — User management
- `/dashboard/notifications` — Notifications
- `/dashboard/funding` — Funding
- `/dashboard/assets` — Asset management

---

## 12. Theme & UI

- **Default theme:** Light (white)
- **Theme system:** `next-themes` with `ThemeProvider` in both `app/layout.tsx` and `app/marketing/layout.tsx`
- **Logos:** `black_logo.png` (light mode), `white_logo.png` (dark mode) — 160x40 fill container
- **Favicons:** `black_AM_fav.png` (light), `white_AM_fav.png` (dark)
- **UI Style:** Bloomberg McKinsey executive style (grid background, gradient orb, no hover effects on auth pages)
- **Component library:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS 4 + CSS variables (design tokens in `lib/design-tokens.ts`)

---

## 13. NPM Scripts

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Build for production (ignores TS errors)
npm run start        # Start production server
npm run lint         # ESLint
```

### Build Note
TypeScript build errors are intentionally ignored (`ignoreBuildErrors: true` in `next.config.ts`). The production build also uses `NEXT_LINT_DISABLED=true`.

---

## 14. Vercel Deployment (Alternative)

Config in `vercel.json`:
- Uses `@vercel/next.js` builder
- Cron job: `/api/cron/check-contracts` daily at 9 AM
- Environment variables referenced via `@` aliases (must be set in Vercel dashboard)

Deploy script: `deploy-now.sh` (requires Vercel token)

---

## 15. OpenSign Integration

- **Server URL:** `http://localhost:8081/app` (Parse Server API)
- **APP_ID:** `opensign`
- **MASTER_KEY:** `XnAadwKxxByMr`
- **Signing bonus:** ₹1,500 for creators with < 50,000 followers
- **Webhook:** `POST /api/webhooks/opensign` — handles document.signed, document.completed, document.cancelled
- **Contract flow:** Create in OpenSign → Send to signers → Webhook on completion → Bonus trigger

---

## 16. Known Issues & TODOs

### Incomplete / Placeholder
1. **YouTube OAuth** — Client ID/secret are placeholders. Need Google Cloud Console setup.
2. **LinkedIn OAuth** — Client ID/secret are placeholders. Need LinkedIn Developer setup.
3. **Stripe** — Test keys only. Need live Stripe account for production.
4. **Resend** — API key not configured. Email sending won't work.
5. **Razorpay** — Keys not configured.
6. **Middleware auth** — Currently disabled (`middleware.ts.disabled`). Auth is per-page.
7. **MeiliSearch** — Configured in dev docker-compose but not actively used in API routes.
8. **IoT/BCI/WebSocket** — Services exist in `lib/` but are experimental/unused.
9. **Three.js** — 3D library included but not actively used in current pages.

### Active Development Areas
- Social media integrations (Instagram done, YouTube/LinkedIn pending credentials)
- Payment processing (Stripe Connect in test mode)
- Contract signing flow (OpenSign working, bonus logic tested)
- CRM sync (Nango self-hosted working, needs provider config)
- Landing page (Phase 1-2 complete, Phase 3 in progress)

---

## 17. Quick Start for New Agent

```bash
# 1. Navigate to project
cd /Volumes/DA/am-creator-analytics

# 2. Check current state
git status
git log --oneline -5

# 3. Start development (option A: Docker services + local app)
docker compose up -d          # Start DB, Nango, Redis, etc.
npm run dev                   # Start Next.js on localhost:3000

# 4. Start development (option B: Full Docker production)
docker compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache app
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 5. Verify health
curl http://localhost:3000/api/health

# 6. View logs
docker compose -f docker-compose.prod.yml logs -f app
```

### Key Files to Read First
1. `AM_Creator_Analytics_Docker_Context.md` — Docker deployment reference
2. `WORK_LOG.md` — Recent development history
3. `prisma/schema.prisma` — Database schema
4. `lib/opensign.ts` — Contract creation flow
5. `app/api/webhooks/opensign/route.ts` — Webhook + bonus logic
6. `app/api/contracts/create/route.ts` — Contract creation endpoint

---

## 18. Security Notes

- **Security headers** configured in `next.config.ts` (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- **API routes** have `Cache-Control: no-store` header
- **2FA** implemented (speakeasy TOTP)
- **DPDP Act** compliance endpoint (`/api/dpdpa`) for Indian data protection
- **GDPR** admin panel (`/dashboard/admin/gdpr`)
- **Middleware auth** is currently disabled — enable from `middleware.ts.disabled` for production

---

## 19. Cost Savings (Self-Hosted vs SaaS)

| Service | Self-Hosted | SaaS Alternative | Monthly Savings |
|---------|------------|-----------------|-----------------|
| OAuth/CRM Sync | Nango (self-hosted) | Merge.dev | ₹40K-1.6L |
| File Storage | MinIO | Cloudinary | ₹10K |
| Search | MeiliSearch | Algolia | ₹15K |
| Cache | Redis (self-hosted) | Redis Cloud | ₹10K |
| E-Signatures | OpenSign (self-hosted) | DocuSign | ₹20K |

---

*This document should be kept in the project root as `HANDOVER.md` and updated as the project evolves.*
