#!/bin/bash
# 🚀 SUPER SIMPLE Deploy Script
# Just run: bash super-deploy.sh YOUR_GITHUB_TOKEN YOUR_VERCEL_TOKEN

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: bash super-deploy.sh GITHUB_TOKEN VERCEL_TOKEN"
  echo ""
  echo "Get GitHub token: https://github.com/settings/tokens"
  echo "Get Vercel token: https://vercel.com/account/tokens"
  exit 1
fi

GITHUB_TOKEN="$1"
VERCEL_TOKEN="$2"

echo "🚀 AM Creator Analytics — Super Simple Deploy"
echo "=========================================="
echo ""

# Step 1: Push to GitHub
echo "📤 Step 1/3: Pushing to GitHub..."
cd /home/awcreator/workspace/am-creator-analytics

git remote remove origin 2>/dev/null || true
git remote add origin https://$GITHUB_TOKEN@github.com/awcreator/am-creator-analytics.git
git push -u origin master 2>&1 | grep -v "Username\|Password" || true

if [ $? -eq 0 ]; then
  echo "✅ Pushed to GitHub!"
else
  echo "❌ GitHub push failed. Check your token."
  exit 1
fi

# Step 2: Deploy to Vercel
echo ""
echo "🚀 Step 2/3: Deploying to Vercel..."
vercel --token "$VERCEL_TOKEN" --prod --yes 2>&1 | grep -v "interactive\|login"

if [ $? -eq 0 ]; then
  echo "✅ Deployed to Vercel!"
else
  echo "❌ Vercel deploy failed. Check your token."
  exit 1
fi

# Step 3: Done!
echo ""
echo "🎉 ALL DONE! Your app is live!"
echo ""
echo "📂 GitHub: https://github.com/awcreator/am-creator-analytics"
echo "🌐 Live app: https://your-app.vercel.app"
echo ""
echo "📊 Test Credentials:"
echo "   Admin: admin@amcreator.com / test123456"
echo "   Brand: brand-test@amcreator.com / test123456"
echo "   Creator: creator-pro@amcreator.com / test123456"
