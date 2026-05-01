# 🚀 Production Deployment Guide

## Overview
Get AM Creator Analytics LIVE on **Vercel** (frontend) + **Railway/Render** (backend services).

## 📋 Pre-Deployment Checklist
- [ ] All features built (18 pages, 15+ API routes)
- [ ] Build passing locally (Next.js 15 + Webpack)
- [ ] Environment variables ready
- [ ] GitHub repo created and pushed
- [ ] OpenSign self-hosted instance running
- [ ] MeiliSearch, MinIO, Nango, Postgres running

## 🌐 Step 1: Push to GitHub
```bash
cd /home/awcreator/workspace/am-creator-analytics

# If you haven't created the repo yet:
# 1. Go to https://github.com/new
# 2. Repo name: am-creator-analytics
# 3. DO NOT initialize with README, .gitignore, or license
# 4. Click "Create repository"

# Add remote (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/am-creator-analytics.git

# Push all 39 commits!
git push -u origin master
```

## ▲ Step 2: Deploy to Vercel (Frontend)
1. Go to https://vercel.com/new
2. Import your GitHub repo: `am-creator-analytics`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

4. **Environment Variables** (add these):
   ```
   DATABASE_URL=postgresql://user:pass@your-postgres-host:5432/am_creator_analytics
   NEXTAUTH_URL=https://your-vercel-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key-change-in-prod
   RESEND_API_KEY=your-resend-api-key
   NANGO_SECRET_KEY=your-nango-secret
   MINIO_ENDPOINT=https://your-minio-host:9000
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   MEILI_HOST=https://your-meilisearch-host:7700
   MEILI_MASTER_KEY=your-meili-master-key
   OPENAI_API_KEY=your-openai-key
   ```

5. Click **Deploy** 🚀
   - Vercel will build and deploy automatically
   - Should take 2-3 minutes
   - You'll get a live URL like: `https://am-creator-analytics.vercel.app`

## 🚂 Step 3: Deploy Backend Services

### Option A: Railway (Recommended)
1. Go to https://railway.app/new
2. Deploy from GitHub repo
3. Add PostgreSQL plugin
4. Add environment variables
5. Deploy!

### Option B: Render
1. Go to https://render.com
2. New + Web Service
3. Connect GitHub repo
4. Select runtime: Node.js
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Add PostgreSQL (from Render dashboard)
8. Add environment variables
9. Deploy!

## 🐳 Step 4: Deploy Docker Services (MinIO, MeiliSearch, Nango)
Use **Railway**, **Render**, or **Fly.io** to deploy:
- MinIO (object storage)
- MeiliSearch (search)
- Nango (CRM sync)
- OpenSign (contracts)

**Or self-host** on your Arch Linux + Docker setup:
```bash
cd /home/awcreator/workspace/am-creator-analytics
docker-compose up -d
```

## ✅ Step 5: Post-Deployment Verification
1. **Visit your Vercel URL**
2. **Login** with test credentials:
   - Admin: `admin@amcreator.com` / `test123456`
   - Brand: `brand-test@amcreator.com` / `test123456`
   - Creator: `creator-pro@amcreator.com` / `test123456`
3. **Test features**:
   - Create a campaign
   - Send a contract (OpenSign)
   - Upload a file (MinIO)
   - Search creators (MeiliSearch)
   - Check notifications
4. **Verify webhooks**:
   - OpenSign webhook: `https://your-domain.vercel.app/api/webhooks/opensign`
   - Stripe webhook: `https://your-domain.vercel.app/api/stripe/webhook`
   - Nango webhook: `https://your-domain.vercel.app/api/nango/webhook`

## 🔒 Step 6: Security & Hardening
1. **Change default passwords**:
   - Postgres password
   - MinIO credentials
   - MeiliSearch master key
2. **Enable rate limiting** (Upstash Rate Limit)
3. **Set up monitoring** (Sentry, Grafana)
4. **Configure CSP headers** (Helmet.js)
5. **Enable HTTPS** (Vercel does this automatically)

## 📊 Cost Breakdown (Monthly)
| Service | Free Tier | Paid Tier |
|---------|-----------|----------|
| Vercel (Frontend) | ✅ Free (Hobby) | $20/month (Pro) |
| Railway (Backend) | $5/month (Starter) | $20/month+ |
| Supabase (Postgres) | ✅ Free (500MB) | $25/month |
| Resend (Email) | ✅ Free (3K/month) | $20/month |
| **Total** | **$5-10/month** | **$85-100/month** |

**With self-hosted services (your preference):**
- MinIO, MeiliSearch, Nango on your Arch Linux server: **$0/month** (just electricity!)
- Total: **$5-10/month** (just Vercel + Railway)

## 🎉 You're LIVE!
Share your live URL:
- **Demo**: `https://am-creator-analytics.vercel.app`
- **Documentation**: `https://am-creator-analytics.vercel.app/docs`
- **GitHub**: `https://github.com/YOUR_USERNAME/am-creator-analytics`

## 🚀 Next Steps After Deployment
1. **Custom domain** (buy `amcreator.com` or similar)
2. **SEO optimization** (meta tags, sitemap)
3. **Analytics** (Vercel Analytics, Google Analytics)
4. **Marketing site** (landing page for signups)
5. **Payment integration** (go live with Stripe Connect)

---

**Ready to deploy? Say "deploy now" and I'll guide you step-by-step!** 🚀
