# 🎬 AM CREATOR ANALYTICS — DEMO SCRIPT
**Date:** May 1, 2026  
**Duration:** 15-20 minutes  
**Audience:** [Specify: Investors/Clients/Team]

---

## 🎯 DEMO GOALS
1. Showcase multi-tenant SaaS architecture
2. Demonstrate Bloomberg × McKinsey design system
3. Highlight key features: Contracts, Payments, Analytics
4. Show OpenSign integration & signing bonus workflow
5. Prove cost savings: ₹32L/year (open-source stack)

---

## 📋 PRE-DEMO CHECKLIST
- [ ] Start PostgreSQL: `echo "asantosh1@97A" | sudo -S -u postgres psql -c "SELECT 1;"` (should work)
- [ ] Start Next.js: `cd /home/awcreator/workspace/am-creator-analytics && npm run dev`
- [ ] Start OpenSign: `cd /home/awcreator/workspace && python3 opensign_webhook_server.py &`
- [ ] Verify health: `curl http://localhost:3000/api/health` (should return 200)
- [ ] Prepare demo accounts:
  - Admin: admin@amcreator.com / test123456
  - Brand: brand-test@amcreator.com / test123456
  - Creator Pro: creator-pro@amcreator.com / test123456
  - Creator Elite: creator-elite@amcreator.com / test123456

---

## 🎬 DEMO FLOW (15-20 minutes)

### **1. INTRO (2 min)**
**Say:** "AM Creator Analytics is a multi-tenant SaaS platform connecting brands with creators. Built with Next.js, Prisma, and open-source tools to save ₹32L/year in SaaS costs."

**Show:**
- Landing page: `http://localhost:3000`
- Bloomberg × McKinsey design (cream bg `#F8F7F4`, dark `#1a1a2e`, accent `#92400e`)

---

### **2. ADMIN DASHBOARD (3 min)**
**Login:** http://localhost:3000/login  
**Credentials:** admin@amcreator.com / test123456

**Show:**
- `http://localhost:3000/[tenantId]/dashboard` (use `test-tenant` or similar)
- Stats cards: Total creators, campaigns, revenue
- Navigation: Dashboard, Campaigns, Creators, Payouts, Settings
- Design consistency (every page matches Bloomberg × McKinsey)

**Key Point:** "Multi-tenant architecture — each brand gets isolated data."

---

### **3. CREATOR MANAGEMENT (3 min)**
**Navigate:** `/[tenantId]/creators`

**Show:**
- Creator list with follower counts, status
- Filter by platform (Instagram, YouTube, LinkedIn)
- View creator profile: `http://localhost:3000/creators/[creatorId]`
- Signing bonus logic: ₹1,500 for 50K+ followers

**Demo Action:**
1. Click "Add Creator"
2. Fill form: Name, Email, Platform, Followers (e.g., 75000)
3. Submit → Should trigger ₹1,500 signing bonus
4. Show creator in list

---

### **4. CONTRACT CREATION & OPENSIGN (5 min)**
**Navigate:** `/[tenantId]/contracts` → "Create Contract"

**Show:**
- Contract form: Select creator, template, payment terms
- **OpenSign Integration:**
  1. Select template (OpenSign template ID configured)
  2. Fill contract details
  3. Click "Send for Signature"
  4. **OpensSign webhook** receives `document.signed` event
  5. **Signing bonus** auto-applied if eligible

**Demo Action:**
1. Create a contract for the creator added above
2. Show OpenSign webhook logs: `tail -f /tmp/opensign_webhook.log`
3. Verify webhook receives: `document.signed`, `completed`
4. Check database: Signing bonus added to creator's payout

**Key Point:** "Fully automated contract workflow with legal e-signature compliance."

---

### **5. PAYMENT & CASHFREE (3 min)**
**Navigate:** `/[tenantId]/payouts`

**Show:**
- Payout dashboard: Pending, completed, failed
- **Cashfree Integration:**
  - Brand plan: ₹299/month
  - Creator Pro: ₹29/month
  - Creator Elite: ₹99/month
- GST invoice generation (Indian compliance)

**Demo Action:**
1. Click "Create Payout" for a creator
2. Show Cashfree payment link generation
3. Display GST invoice (PDF download)

---

### **6. ANALYTICS & REPORTING (3 min)**
**Navigate:** `/[tenantId]/dashboard/analytics`

**Show:**
- Campaign performance charts
- Creator ROI metrics
- Export to Excel/CSV
- Advanced: Cohort analysis, LTV calculator (PM-14)

---

### **7. BRAND & CREATOR VIEWS (2 min)**
**Switch to Brand account:** brand-test@amcreator.com  
**Show:**
- Brand dashboard: Their campaigns only
- Browse creator marketplace
- Create campaign brief

**Switch to Creator account:** creator-pro@amcreator.com  
**Show:**
- Creator portfolio page: `http://localhost:3000/creators/[creatorId]`
- Earnings dashboard
- Available campaigns

---

### **8. COST SAVINGS & OPEN-SOURCE STACK (2 min)**
**Say:** "We eliminated all SaaS costs by using open-source alternatives:"

| Feature | Paid SaaS | Our Solution | Savings/Year |
|---------|-----------|--------------|---------------|
| E-signatures | DocuSign ($750/mo) | **OpenSign (self-hosted)** | ₹9L |
| Integration Platform | Merge.dev ($500/mo) | **Nango (self-hosted)** | ₹6L |
| Database | Mongo Atlas ($500/mo) | **PostgreSQL (self-hosted)** | ₹6L |
| Storage | S3 ($200/mo) | **MinIO (self-hosted)** | ₹2.4L |
| Payments | Razorpay (2% fee) | **Cashfree (1% fee)** | ₹2L+ |
| Monitoring | Datadog ($500/mo) | **Grafana + Prometheus** | ₹6L |

**Total Savings: ₹32L/year (~$38K USD)**

---

### **9. CONCLUSION (1 min)**
**Say:** "AM Creator Analytics demonstrates enterprise-grade SaaS without vendor lock-in. 46+ features built, Bloomberg × McKinsey design, full Indian compliance (GST, UPI, PAN). Ready for production."

**Call to Action:**
- GitHub: https://github.com/awcreator/am-creator-analytics
- Live demo: http://localhost:3000
- Contact: [Your email]

---

## 🚨 TROUBLESHOOTING (If things break)

### **Login not working?**
Use demo login API:
```bash
curl -X POST http://localhost:3000/api/demo-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amcreator.com"}' \
  -c cookies.txt
```

### **Database connection failed?**
```bash
# Check PostgreSQL
echo "asantosh1@97A" | sudo -S -u postgres psql -c "SELECT 1;"
# Recreate DB if needed
cd /home/awcreator/workspace/am-creator-analytics
npx prisma db push
```

### **OpenSign not responding?**
```bash
# Restart OpenSign
pkill -f opensign_webhook_server.py
cd /home/awcreator/workspace && python3 opensign_webhook_server.py &
```

### **Next.js crashes?**
```bash
# Clear cache and restart
cd /home/awcreator/workspace/am-creator-analytics
rm -rf .next
npm run dev
```

---

## 📸 KEY SCREENS TO SCREENSHOT (Backup)
1. Admin dashboard with stats
2. Creator list with filters
3. Contract creation form
4. OpenSign webhook logs
5. Payout dashboard
6. Analytics charts
7. Brand vs Creator views
8. Cost savings table

---

## 🎥 POST-DEMO ACTIONS
- [ ] Send follow-up email with GitHub repo link
- [ ] Share demo recording (if recorded)
- [ ] Collect feedback via Google Forms
- [ ] Schedule next steps meeting

---

**Good luck! You've built 46+ features — own it! 🚀**
