# Deploy to Vercel - Step by Step

## 🚀 Quick Deploy (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
# Choose: GitHub / GitLab / Bitbucket / Email
```

### Step 3: Deploy
```bash
cd /home/awcreator/workspace/am-creator-analytics
vercel --prod
```

### Step 4: Set Environment Variables
During deploy, Vercel will ask for env vars. Copy from your `.env` file:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_32_char_secret
OPENSIGN_API_KEY=your_opensign_key
NANGO_SERVER_URL=http://your-nango-server:3003
NANGO_SECRET_KEY=your_nango_key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🌐 Deploy via Vercel Dashboard (Easier!)

### Step 1: Push to GitHub First
```bash
cd /home/awcreator/workspace/am-creator-analytics

# If SSH doesn't work, use HTTPS:
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/am-creator-analytics.git
git push -u origin master
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. **Import** your `am-creator-analytics` repo
3. Vercel auto-detects Next.js
4. Add environment variables (copy from `.env.example`)
5. Click **Deploy** 🚀

---

## 🔧 Post-Deployment Steps

### 1. Update NextAuth URL
```bash
# In Vercel dashboard → Settings → Environment Variables
NEXTAUTH_URL=https://your-app.vercel.app
```

### 2. Update OpenSign Webhook
```bash
# In OpenSign dashboard, update webhook URL to:
https://your-app.vercel.app/api/webhooks/opensign
```

### 3. Update Stripe Webhook
```bash
# In Stripe dashboard → Webhooks, add:
https://your-app.vercel.app/api/stripe/webhook
```

### 4. Test Production
```bash
# Visit your live app:
https://your-app.vercel.app
```

---

## 📊 What's Deployed

All 17 commits, 16 pages, 13 API routes:
- ✅ Agency Command Center
- ✅ Brand / Creator Dashboards
- ✅ Campaign & Contract Management
- ✅ Stripe Connect Payouts
- ✅ Nango CRM Integration
- ✅ DPDPA Compliance
- ✅ Notification System
- ✅ Media Kit for Creators

**Bloomberg × McKinsey design** throughout! 🎨

---

## 💰 Cost Savings in Production

| Tool | Our Solution | Savings/month |
|------|-------------|---------------|
| Merge.dev | **Nango (self-hosted)** | ₹40K–1.6L |
| DocuSign | **OpenSign (self-hosted)** | ₹20K |
| Mongo Atlas | **PostgreSQL** | ₹10K |
| Zapier | **n8n (self-hosted)** | ₹10K |
| **Total** | | **₹80K–2L/month** |

---

## 🆘 Troubleshooting

**Build fails?**
```bash
# Test build locally first:
cd /home/awcreator/workspace/am-creator-analytics
npx next build
```

**Database connection issues?**
- Make sure `DATABASE_URL` is set correctly in Vercel
- Use Railway / Neon / Supabase for hosted PostgreSQL

**OpenSign not working?**
- Deploy OpenSign separately: https://github.com/OpenSignLabs/OpenSign
- Update `OPENSIGN_API_KEY` in Vercel env vars

---

**Need help?** Just say:
- "fix build errors" → I'll debug
- "set up database" → I'll guide through Railway/Supabase
- "configure webhooks" → I'll update URLs

**🚀 Ready to deploy!**
