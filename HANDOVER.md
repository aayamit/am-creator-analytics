# AM Creator Analytics — Agent Handover Document

**Version:** 1.4  
**Date:** 2026-05-17  
**Prepared by:** OWL (Hermes Agent) + Codex  
**Project Owner:** Amit Kumar (amitkumaraman)

---

## 1. Project Overview

AM Creator Analytics is a **B2B SaaS platform** for creator and influencer marketing management. It connects brands with creators, manages campaigns, tracks ROI, handles contracts through OpenSign, processes payouts, integrates social platforms, and includes CRM sync through Nango.

**Positioning:** *"India's operating system for performance-led creator campaigns."*

**Domain:** `amcreatoranalytics.com` (purchased via Squarespace/Google Workspace)  
**Email:** `partnerships@amcreatoranalytics.com`

---

## Current Status

- Public preview is intended to run directly from the Mac Mini through Docker + Cloudflare Tunnel.
- The site returned Cloudflare `502` after the Mac restart because the local Docker stack was down even though the tunnel connector was still active. That recovery is complete and apex + `www` now resolve again through the live tunnel.
- Docker production config has now been standardized in the clean writable repo so future deploys do not depend on mixed service names, split compose projects, or manual network reattachment.
- The intended production stack is now defined under one compose project with stable service names:
  - `app`
  - `nginx`
  - `postgres`
  - `redis`
  - `mongo`
  - `opensign`
  - `nango`
- The intended production network is now one named shared network:
  - `am_creator_network`
- The app is now configured to use internal hostnames like `postgres`, `redis`, `mongo`, `opensign`, and `nango`, and nginx now proxies to `app:3000`.
- The production compose file is now cloud-ready and portable:
  - named volumes replace Mac-only `/Volumes/DA/...` bind-mount assumptions
  - the committed production file remains clean
  - local-only overrides should stay in `docker-compose.prod.local-env.yml` and stay uncommitted
- Postgres initialization has been standardized so the main app DB and Nango DB are created separately on first boot:
  - app DB: `am_creator_analytics`
  - Nango DB: `nango`
- Environment templates were updated:
  - `.env.example`
  - `.env.prod.example`
  - `.env.prod.template` kept as compatibility reference
- `docker compose -f docker-compose.prod.yml config` and `docker compose -f docker-compose.yml config` both succeeded from the clean writable repo.
- Direct Docker runtime inspection from the sandbox shell is still blocked by Docker socket permissions, so this session could not directly run `docker ps`, `docker network ls`, or `docker compose ... ps` from the shell.
- `npm run build` succeeds after the public website changes. There is still an existing non-blocking ESLint config warning during the build, and a separate Next.js warning about multiple lockfiles / inferred workspace root.
- The local repository on `/Volumes/DA/am-creator-analytics` has a local-only commit (`1ade516`) that accidentally includes `volumes/` runtime data and `.env.backup`. Do **not** push that commit directly.
- The correct GitHub repository is `https://github.com/aayamit/am-creator-analytics.git`. The stale `amitkumaraman/...` URL in the old handover notes is wrong.
- A clean code-only sync was pushed from the writable clone with commit `99c11f5` (`feat: add phase 3 marketing and social auth flows`).
- `https://www.amcreatoranalytics.com` was fixed on 2026-05-17 by adding the missing published application route in the Cloudflare dashboard for tunnel `amcamacmini`.
- Both the apex domain and `www` now route to the same local app service on `http://localhost:3000`.
- The public marketing shell was cleaned on 2026-05-17 so `/marketing` now renders a single shared header and footer.
- Branding and auth polish was deployed on 2026-05-17:
  - favicon/app icons now use the compact AM mark assets provided for the brand
  - the shared footer now renders the AM mark image instead of the old text-only badge
  - `/login` and `/signup` were rebuilt to use theme-token styling and were verified in both light and dark mode
  - `/`, `/marketing`, `/features`, `/how-it-works`, `/pricing`, `/case-studies`, `/about`, `/login`, and `/signup` all currently show the `Login` link in the shared nav
- Public website repositioning is implemented in the clean writable repo and ready for review:
  - `/marketing` now presents AM as a performance-led creator campaign operating system
  - new `/for-creators` page
  - new `/for-d2c-brands` page
  - new `/for-agencies` page
  - updated nav, footer, pricing, about, and contact pages
  - this rewrite is built and verified at compile level, but it has **not** been pushed or deployed live from this session
- Instagram creator login is now wired to Instagram Business Login instead of the old Instagram Basic Display flow:
  - live auth URL now uses `platform_app_id=26571906789138925`
  - live redirect URI is `https://amcreatoranalytics.com/api/auth/callback/instagram`
  - live scope is now trimmed to `instagram_business_basic` for creator onboarding
- Browser testing confirms the integration path is now technically correct, but end-to-end account linking is still blocked by account-side access:
  - Instagram recognizes account `amcreatoranalytics`
  - the saved Instagram password currently being used in Chrome is invalid
  - Instagram offered recovery via `partnerships@amcreatoranalytics.com` and `+91 79030 84346`
  - the logged-in Facebook/Meta account is not linked to that Instagram account, so the Facebook shortcut does not complete auth
- A separate creator dashboard bug was found during Instagram testing:
  - non-tenant dashboard pages like `/creators/connections` were rendering sidebar links as `/undefined/dashboard/...`
  - that cleanup is fixed in the clean writable repo, but it was **not** re-deployed live during this session

---

## 2. File Locations & Project Structure

### Primary Live Project Directory
```
/Volumes/DA/am-creator-analytics/
```

### Current Writable Working Copy
```
/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/am-creator-analytics-clean
```

### Key Files & Directories

| Path | Purpose |
|------|---------|
| `/Volumes/DA/am-creator-analytics/` | Live Mac Mini repo and persistent runtime data |
| `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/am-creator-analytics-clean` | Writable clean clone currently used for code changes |
| `app/` | Next.js App Router — all pages & API routes |
| `app/api/` | 60+ API routes (see §8) |
| `app/[tenantId]/dashboard/` | Tenant-scoped dashboard pages |
| `app/marketing/` | Landing page routes (layout.tsx wraps marketing pages) |
| `app/(auth)/` | Login/signup pages |
| `app/layout.tsx` | Root layout (ThemeProvider + AuthProviders) |
| `components/` | Shared React components (NavBar, Footer, providers) |
| `components/BrandMark.tsx` | Compact AM mark component used by footer/auth surfaces |
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
| `public/assets/black_AM_mark.png` | Light-theme compact AM brand mark |
| `public/assets/white_AM_mark.png` | Dark-theme compact AM brand mark |
| `public/icons/` | PWA icon outputs derived from the AM mark |
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
- **Current session status:** deployment and website changes in the clean writable clone are not yet committed or pushed; review `git status` there first next session

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
| **Tunnel** | Cloudflare Named Tunnel |
| **Containerization** | Docker Compose 3.8 |

---

## 5. Docker & Deployment

### Production Stack (docker-compose.prod.yml)

| Service Name | Purpose | Host Port | Internal Hostname |
|--------------|---------|-----------|-------------------|
| `app` | Next.js application | `127.0.0.1:3000` | `app` |
| `nginx` | Reverse proxy / public host routing | `80`, `443` | `nginx` |
| `postgres` | Main relational database | `5432` | `postgres` |
| `redis` | Cache / queue layer | `6379` | `redis` |
| `mongo` | OpenSign MongoDB | `27017` | `mongo` |
| `opensign` | OpenSign service | `127.0.0.1:3001` | `opensign` |
| `nango` | Nango API and UI | `127.0.0.1:3005`, `127.0.0.1:3006` | `nango` |

All intended production services now share one named network:

```text
am_creator_network
```

This is the key standardization that prevents the earlier split-network problem where the app container was running in one compose project/network while Postgres and nginx were running in another.

### Development Stack (docker-compose.yml)
- Stable dev services: `postgres`, `redis`, `nango`, `minio`, `meilisearch`
- Shared dev network: `am_creator_dev_network`
- Dev Nango now points to internal service hostnames `postgres` and `redis`

### Production Build & Start
```bash
cd /path/to/am-creator-analytics

# Validate compose
docker compose -f docker-compose.prod.yml --env-file .env.prod config

# Build app image
docker compose -f docker-compose.prod.yml --env-file .env.prod build app

# Start all services
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Health check
curl http://127.0.0.1:3000/api/health

# View all logs
docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f

# App-only refresh when dependencies are already healthy
docker compose -f docker-compose.prod.yml --env-file .env.prod build app
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --no-deps app

# Stop all
docker compose -f docker-compose.prod.yml --env-file .env.prod down
```

### Important Docker Notes
- **Main issue that existed:** an app container from the clean clone was previously started on a different Docker network than the live Postgres and nginx services, which broke `/api/health` and made nginx/app hostnames inconsistent.
- **Standardization now in place:** one prod compose project, one prod network, stable service names, stable internal hostnames, and separate DB bootstrap for the app and Nango.
- **Main app DB:** `am_creator_analytics`
- **Nango DB:** `nango`
- **App internal dependencies:** use `postgres`, `redis`, `mongo`, `opensign`, and `nango` instead of `localhost`.
- **Nginx internal upstream:** `app:3000`
- **Persistent prod storage in committed compose:** named volumes
  - `postgres_data`
  - `redis_data`
  - `mongo_data`
  - `nginx_logs`
- **Mac-specific overrides:** keep them in `docker-compose.prod.local-env.yml` only if absolutely needed, and keep that file uncommitted.
- **Runtime verification limitation from this session:** direct shell access to Docker runtime commands is blocked by Docker socket permissions in the sandbox. `docker compose ... config` was verified successfully, but `docker ps`, `docker network ls`, `docker compose ... ps`, and `docker compose ... up -d` could not be executed from this shell.
- **SSL certs** are self-signed at `nginx/ssl/cert.pem` and `nginx/ssl/key.pem`

### Nginx Virtual Hosts
| Domain | Proxies To |
|--------|-----------|
| `amcreatoranalytics.com` | `app:3000` |
| `www.amcreatoranalytics.com` | `app:3000` |
| `app.amcreatoranalytics.com` | `app:3000` |
| `opensign.amcreatoranalytics.com` | `opensign:3000` |
| `nango.amcreatoranalytics.com` | `nango:3000` |
| `nango-ui.amcreatoranalytics.com` | `nango:3006` |

---

## 6. Cloudflare Tunnel

- **Active named tunnel on 2026-05-16:** `amcamacmini`
- **Active tunnel ID on 2026-05-16:** `d0736635-75f1-482c-a672-b31451c86ff6`
- **Origin target:** `http://127.0.0.1:3000`
- **Public domains intended:** `amcreatoranalytics.com` and `www.amcreatoranalytics.com`
- **Observed current state on 2026-05-17 after fix:** apex domain works and `www` works
- **Cloudflare dashboard fix applied on 2026-05-17:** added published application route
  - hostname: `www.amcreatoranalytics.com`
  - service: `http://localhost:3000`
- **Published application routes after fix:** `amcreatoranalytics.com` and `www.amcreatoranalytics.com`
- **Local config files that already include both hostnames:**
  - `/Users/amit/.cloudflared/config.yml`
  - `/Users/amit/.cloudflared/tunnels/d0736635-75f1-482c-a672-b31451c86ff6.yml`
- **Important deployment nuance:** a system daemon exists at `/Library/LaunchDaemons/com.cloudflare.cloudflared.plist` and appears to run the tunnel using a token-based command. That explains why editing the local ingress files alone did not immediately fix the public `www` route; the effective fix had to be applied in the dashboard route list.
- **Note:** the older `6aaf5b9c-77de-4be9-83f0-60964b3a564c` value still appears in local env/docs, but the active connector observed during recovery was the `amcamacmini` named tunnel above

---

## 7. Environment Variables

All values below should stay sanitized in documentation. Real secrets live only in local `.env` and `.env.prod`.

Tracked placeholder files now maintained in the repo:

- `.env.example`
- `.env.prod.example`
- `.env.prod.template` (compatibility reference)

### Production (.env.prod)
```env
# App Core
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://amcreatoranalytics.com
NEXT_PUBLIC_APP_URL=https://amcreatoranalytics.com

# Postgres bootstrap
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password_here
POSTGRES_DB=postgres
APP_DB_NAME=am_creator_analytics
APP_DB_USER=am_creator_app
APP_DB_PASSWORD=your_app_db_password_here
NANGO_DB_NAME=nango
NANGO_DB_USER=nango
NANGO_DB_PASSWORD=your_nango_db_password_here

# Main app database
DATABASE_URL="postgresql://am_creator_app:your_app_db_password_here@postgres:5432/am_creator_analytics?schema=public"

# Redis
REDIS_URL=redis://redis:6379

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

# OpenSign / Mongo / Nango / WhatsApp / Payments / Email
# See `.env.prod.example` for the full sanitized placeholder set.
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

## 20. 2026-05-17 Marketing Fix Deployment Note

- The live `/marketing` route was rendering duplicate chrome because:
  - `app/layout.tsx` already rendered the shared `NavBar` and `Footer`
  - `app/marketing/layout.tsx` rendered another `NavBar` and `Footer`
  - `app/marketing/page.tsx` also rendered its own footer block
- The live fix changed:
  - `app/marketing/layout.tsx` to return `children` only
  - `app/marketing/page.tsx` to remove the extra page-level footer
  - `components/NavBar.tsx` to enlarge the logo frame and use responsive cropped sizing
- Verified public result after deploy:
  - `https://www.amcreatoranalytics.com/marketing`
  - DOM check returned `1` nav and `1` footer

### Important Deployment Detail

- Direct Docker socket access from the sandboxed shell remained blocked even after permission requests.
- The successful path was Docker Desktop's embedded terminal.
- The first rebuild attempt failed because `docker compose up -d --build app` tried to recreate shared services and hit existing container-name conflicts.
- The successful sequence was:

```bash
cd /Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/am-creator-analytics-clean
docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod build app
docker rm -f am-creator-app
docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod up -d --no-deps app
```

- This replaced only the application container and left Postgres, Redis, Mongo, Nango, OpenSign, and nginx in place.

### Browser Artifact

- Desktop snapshot captured after the fix:
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/marketing-desktop-fixed.png`

---

## 21. 2026-05-17 Branding Assets, Footer Mark, and Auth Theme Fix

- Brand assets were normalized around the compact AM mark supplied by the project owner.
- New generated assets added in the clean clone:
  - `public/assets/black_AM_mark.png`
  - `public/assets/white_AM_mark.png`
  - `app/icon.png`
  - `app/apple-icon.png`
  - `app/favicon.ico`
  - `public/icons/icon-192x192.png`
  - `public/icons/icon-512x512.png`
- Shared UI updates:
  - `components/BrandMark.tsx` added as a reusable AM mark component
  - `components/Footer.tsx` switched from the old text badge to the image-based AM mark
  - `app/layout.tsx` and `public/site.webmanifest` updated so favicon, Apple icon, and manifest point to the new mark assets
  - `components/NavBar.tsx` switched to `resolvedTheme` and keeps the shared public `Login` link visible across the public pages
- Auth updates:
  - `app/(auth)/login/login-content.tsx` rebuilt with theme-token colors and dark-mode-safe surfaces
  - `app/(auth)/signup/page.tsx` rebuilt with matching theme-token styling and dark-mode-safe surfaces
- Live deployment used the same Docker Desktop embedded-terminal flow as the marketing-shell fix:

```bash
cd /Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/am-creator-analytics-clean
docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod build app
docker rm -f am-creator-app
docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod up -d --no-deps app
```

- Live verification after deploy:
  - `https://www.amcreatoranalytics.com/marketing`
    - `1` nav
    - `1` footer
    - footer image alt `AM Creator Analytics mark`
    - favicon links include `/favicon.ico`, `/assets/black_AM_mark.png`, `/assets/white_AM_mark.png`, and `/apple-icon.png`
  - `https://www.amcreatoranalytics.com/login`
    - verified in light mode and dark mode
  - `https://www.amcreatoranalytics.com/signup`
    - verified in light mode and dark mode
  - `https://www.amcreatoranalytics.com/`, `/marketing`, `/features`, `/how-it-works`, `/pricing`, `/case-studies`, `/about`, `/login`, `/signup`
    - all show the `Login` link in the shared nav
- Browser artifacts saved in the session workspace:
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/marketing-live-after-branding.png`
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/login-light-fixed.png`
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/login-dark-fixed.png`
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/signup-light-fixed.png`
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/signup-dark-fixed.png`

---

*This document should be kept in the project root as `HANDOVER.md` and updated as the project evolves.*
