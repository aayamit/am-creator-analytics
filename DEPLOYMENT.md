# AM Creator Analytics - Deployment Guide

## 🌐 Production Deployment

### Prerequisites
- Vercel account (frontend)
- Railway / DigitalOcean / AWS account (backend)
- Domain name (optional)
- Production environment variables

---

## Step 1: Prepare Environment Variables

### Create `.env.production`:
```bash
# NextAuth
NEXTAUTH_SECRET=your-production-secret-32-chars-minimum
NEXTAUTH_URL=https://your-domain.com

# Database (Production PostgreSQL)
DATABASE_URL="postgresql://user:password@prod-db-host:5432/am_creator_analytics?schema=public"

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenSign (Production)
OPENSIGN_API_KEY=your-production-opensign-key
OPENSIGN_BASE_URL=https://api.opensign.com

# Nango (Production)
NANGO_SECRET_KEY=your-nango-production-key
NANGO_ADMIN_KEY=your-nango-admin-key
NANGO_ENCRYPTION_KEY=your-32-char-encryption-key
NANGO_CALLBACK_URL=https://your-domain.com/api/nango/callback
NANGO_FRONTEND_URL=https://your-domain.com
NANGO_SERVER_URL=https://nango.your-domain.com

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM="AM Creator Analytics <noreply@your-domain.com>"

# Sentry (Error Monitoring)
SENTRY_DSN=https://...@o...ingest.sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=am-creator-analytics

# Cashfree (Indian Payments)
CASHFREE_CLIENT_ID=your-production-client-id
CASHFREE_CLIENT_SECRET=your-production-client-secret
CASHFREE_ENV=production
```

---

## Step 2: Deploy to Vercel (Frontend)

### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /home/awcreator/workspace/am-creator-analytics
vercel --prod
```

### Option B: Deploy via Git (Recommended)
1. Push code to GitHub/GitLab
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Set environment variables (from Step 1)
6. Click "Deploy"

### Vercel Configuration (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next.js"
    }
  ],
  "env": {
    "NEXTAUTH_URL": "https://your-domain.com",
    "DATABASE_URL": "@am-creator-analytics-db-url",
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "OPENSIGN_API_KEY": "@opensign-api-key",
    "NANGO_SECRET_KEY": "@nango-secret-key"
  }
}
```

---

## Step 3: Deploy Database (PostgreSQL)

### Option A: Railway (Recommended for simplicity)
1. Go to [Railway](https://railway.app)
2. Create new project → "Provision PostgreSQL"
3. Copy the `DATABASE_URL` connection string
4. Run migrations:
```bash
cd /home/awcreator/workspace/am-creator-analytics
npx prisma migrate deploy
```

### Option B: DigitalOcean Managed Database
1. Create PostgreSQL cluster on DigitalOcean
2. Whitelist Vercel IP ranges
3. Update `DATABASE_URL` in environment variables
4. Run migrations (see above)

### Option C: Self-Hosted PostgreSQL
```bash
# On your server
docker run -d \
  --name am-creator-db \
  -e POSTGRES_PASSWORD=your-secure-password \
  -e POSTGRES_DB=am_creator_analytics \
  -p 5432:5432 \
  postgres:16-alpine

# Run migrations
DATABASE_URL="postgresql://postgres:password@your-server:5432/am_creator_analytics?schema=public" \
  npx prisma migrate deploy
```

---

## Step 4: Configure Production Webhooks

### OpenSign Webhook
1. Go to OpenSign dashboard
2. Add webhook URL: `https://your-domain.com/api/webhooks/opensign`
3. Select events: `document.completed`, `document.signed`

### Stripe Webhook
```bash
# Install Stripe CLI
stripe listen --forward-to https://your-domain.com/api/stripe/webhook \
  --api-key sk_live_...
```

Or configure in Stripe Dashboard:
- Endpoint URL: `https://your-domain.com/api/stripe/webhook`
- Events: `payout.paid`, `payout.failed`, `transfer.created`, `account.updated`

### Nango Webhook
- URL: `https://your-domain.com/api/nango/webhook`
- Events: Sync completion events

---

## Step 5: Set Up Nango (Self-Hosted)

### Deploy Nango to DigitalOcean:
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nango:
    image: nango/nango:latest
    restart: always
    ports:
      - "3003:3003"
      - "3004:3004"
    environment:
      - NANGO_DB_URL=postgresql://postgres:password@db:5432/nango?schema=public
      - NANGO_SECRET_KEY=${NANGO_SECRET_KEY}
      - NANGO_ENCRYPTION_KEY=${NANGO_ENCRYPTION_KEY}
      - NANGO_ADMIN_KEY=${NANGO_ADMIN_KEY}
      - NANGO_CALLBACK_URL=https://your-domain.com/api/nango/callback
      - NANGO_FRONTEND_URL=https://your-domain.com
      - NANGO_SERVER_URL=https://nango.your-domain.com
    volumes:
      - nango_data:/tmp/nango

volumes:
  nango_data:
```

---

## Step 6: Verify Deployment

### Health Check:
```bash
# Check homepage
curl https://your-domain.com

# Check API health
curl https://your-domain.com/api/health

# Test login
curl -X POST https://your-domain.com/api/auth/signin
```

### Test Flows:
1. ✅ Login as admin: `admin@amcreator.com`
2. ✅ Create a test campaign
3. ✅ Send contract via OpenSign
4. ✅ Verify signing bonus (₹1,500) triggered
5. ✅ Test Stripe Connect onboarding
6. ✅ Test DPDPA consent & data export

---

## 🚨 Important Notes

### Security Checklist:
- [ ] Change all default secrets (NextAuth, Stripe, Nango)
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable DPDPA compliance (already built ✅)

### Monitoring:
- [ ] Set up Sentry error tracking
- [ ] Configure Nango observability
- [ ] Set up Stripe alerts for failed payouts

---

## 💰 Cost Estimation (Production)

| Service | Provider | Cost/month |
|---------|----------|-------------|
| Frontend Hosting | Vercel | Free (Pro: $20) |
| Database | Railway | $5–20 |
| Nango (Self-Hosted) | DigitalOcean | $12 (1GB droplet) |
| Stripe Connect | Stripe | 2% + ₹3 per payout |
| Email | Resend | Free (3,000/mo) |
| Error Monitoring | Sentry | Free (5K errors/mo) |
| **Total** | | **~$17–35/month** |

**Compare to SaaS alternatives:**
- Merge.dev: $500–2,000/month ❌
- DocuSign: $20,000/month ❌
- Mongo Atlas: $10,000/month ❌
- **TOTAL SAVINGS: ₹70K–1.9L/month** ✅

---

## 🆘 Troubleshooting

### Issue: "Prisma Client not found"
```bash
npx prisma generate
npx prisma migrate deploy
```

### Issue: "Stripe webhook verification failed"
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Verify webhook URL is accessible

### Issue: "Nango sync failing"
- Check Nango logs: `docker logs nango`
- Verify `NANGO_SECRET_KEY` is set
- Check database connection

---

**Deployment complete! Your app is live at: https://your-domain.com** 🎉
