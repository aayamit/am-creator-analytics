# ⚡ QUICK REFERENCE — DEMO TOMORROW

## 🚀 STARTUP (Do this 15 min before demo)

```bash
# 1. Start PostgreSQL (if not running)
echo "asantosh1@97A" | sudo -S -u postgres psql -c "SELECT 1;" || echo "DB already running"

# 2. Start Next.js dev server
cd /home/awcreator/workspace/am-creator-analytics
npm run dev &

# 3. Start OpenSign (optional, for contract demo)
cd /home/awcreator/workspace
python3 opensign_webhook_server.py &

# 4. Verify health
sleep 15
curl http://localhost:3000/api/health
# Should return: {"status":"healthy",...}
```

---

## 🔑 DEMO LOGIN CREDENTIALS

### **Option A: Demo Login API (GUARANTEED TO WORK)**
```bash
# Admin login
curl -X POST http://localhost:3000/api/demo-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amcreator.com"}' \
  -c cookies.txt

# Then visit: http://localhost:3000/test-tenant/dashboard
# (Browser should have demo-session cookie set)
```

### **Option B: NextAuth Login (May work)**
- **Admin:** admin@amcreator.com / test123456
- **Brand:** brand-test@amcreator.com / test123456
- **Creator Pro:** creator-pro@amcreator.com / test123456
- **Creator Elite:** creator-elite@amcreator.com / test123456

---

## 📋 DEMO FLOW (15-20 min)

| Time | Section | URL | Key Points |
|------|---------|-----|------------|
| 0-2 min | Intro | `/` | Bloomberg × McKinsey design, multi-tenant SaaS |
| 2-5 min | Admin Dashboard | `/test-tenant/dashboard` | Stats, navigation, design consistency |
| 5-8 min | Creator Management | `/test-tenant/creators` | Add creator, signing bonus ₹1,500 |
| 8-13 min | Contracts & OpenSign | `/test-tenant/contracts` | Create contract, webhook, e-signature |
| 13-15 min | Payouts & Cashfree | `/test-tenant/payouts` | Payment plans, GST invoices |
| 15-17 min | Analytics | `/test-tenant/dashboard/analytics` | Charts, export, ROI |
| 17-18 min | Brand View | Login as brand | Isolated data, campaign brief |
| 18-20 min | Cost Savings | Show table | ₹32L/year saved, open-source stack |

---

## 🎯 KEY FEATURES TO HIGHLIGHT

✅ **Multi-tenant:** Each brand gets isolated data  
✅ **Bloomberg × McKinsey:** Cream `#F8F7F4`, Dark `#1a1a2e`, Accent `#92400e`  
✅ **OpenSign:** Self-hosted e-signatures (save ₹9L/year)  
✅ **Cashfree:** Indian payments, GST invoices (save ₹2L+/year)  
✅ **Nango:** Self-hosted integrations (save ₹6L/year)  
✅ **Next.js 15:** App Router, TypeScript, Prisma ORM  
✅ **46+ Features:** Analytics, contracts, payouts, KYC, 2FA, and more  

---

## 🚨 IF THINGS BREAK

### **Login not working?**
Use demo login API (GUARANTEED TO WORK):
```bash
curl -X POST http://localhost:3000/api/demo-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amcreator.com"}'
```

### **Database connection failed?**
```bash
cd /home/awcreator/workspace/am-creator-analytics
npx prisma db push
# OR recreate DB:
echo "asantosh1@97A" | sudo -S -u postgres psql -c "DROP DATABASE am_creator_analytics;"
echo "asantosh1@97A" | sudo -S -u postgres psql -c "CREATE DATABASE am_creator_analytics;"
npx prisma db push
```

### **Next.js crashes?**
```bash
cd /home/awcreator/workspace/am-creator-analytics
rm -rf .next
npm run dev
```

### **OpenSign not responding?**
```bash
pkill -f opensign_webhook_server.py
cd /home/awcreator/workspace && python3 opensign_webhook_server.py &
```

---

## 📸 SCREENS TO CAPTURE (Backup)

1. Admin dashboard with stats
2. Creator list with filters
3. Contract creation form
4. OpenSign webhook logs: `tail -f /tmp/opensign_webhook.log`
5. Payout dashboard with payment plans
6. Analytics charts
7. Brand vs Creator views
8. Cost savings table (from DEMO_SCRIPT.md)

---

## 📞 POST-DEMO ACTIONS

- [ ] Send follow-up email with GitHub repo: https://github.com/awcreator/am-creator-analytics
- [ ] Share demo recording (if recorded)
- [ ] Collect feedback via Google Forms
- [ ] Schedule next steps meeting

---

**Good luck! You've built 46+ features — own it! 🚀**
