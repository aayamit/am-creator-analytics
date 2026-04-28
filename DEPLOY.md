# AM Creator Analytics - Deployment Guide

## Quick Start (Docker - Recommended)

Given your self-hosted preference (Arch Linux + Docker), use Docker:

```bash
# 1. Set environment variables
export POSTGRES_PASSWORD="your-secure-password"
export NEXTAUTH_SECRET="$(openssl rand -base64 32)"
export NEXTAUTH_URL="http://your-domain:3000"
export NEXT_PUBLIC_APP_URL="http://your-domain:3000"

# 2. Build and start
docker-compose up -d

# 3. Check logs
docker-compose logs -f app
```

## Alternative: Vercel (Easiest)

If you prefer managed hosting:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/am_creator_analytics"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://your-domain:3000"

# OAuth Providers (optional)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_ID=""
GOOGLE_SECRET=""

# Nango (for platform integrations)
NANGO_SECRET_KEY=""
NANGO_PUBLIC_KEY=""

# Payments (optional)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# Email (optional)
RESEND_API_KEY=""
```

## Post-Deployment Checklist

- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Verify landing page loads with animations
- [ ] Test auth flow (signup/login)
- [ ] Check OAuth connections work
- [ ] Monitor error tracking (Sentry)
- [ ] Set up SSL/TLS (Let's Encrypt)

## Performance Notes

- Production build optimized with:
  - Removed extraneous packages
  - Identified unused dependencies (decimal.js is used by Prisma)
  - Lucide-react imports are tree-shaken
- .next build size: ~910MB (dev) / ~150MB (production)
- PWA-ready with manifest.json
- SEO optimized with sitemap.xml + robots.txt

## Project Status

✅ Landing page: Bloomberg × McKinsey Executive Style
✅ Graphics & Animations: Fade-in, counter animations, terminal glow
✅ Pages tested: Home, Market, Features, Pricing, Blog, About, Contact
✅ Auth flow: Redirects to login working correctly
✅ Docker deployment: Ready
