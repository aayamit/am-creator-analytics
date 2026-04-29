#!/bin/bash
# 🚀 One-Click Deploy to Vercel
# Usage: bash deploy-now.sh YOUR_VERCEL_TOKEN

if [ -z "$1" ]; then
  echo "Usage: bash deploy-now.sh YOUR_VERCEL_TOKEN"
  echo ""
  echo "Get your Vercel token from: https://vercel.com/account/tokens"
  exit 1
fi

VERCEL_TOKEN="$1"
echo "🚀 AM Creator Analytics - One-Click Deploy"
echo "=========================================="
echo ""

# Check if logged in
echo "🔐 Using Vercel token..."
vercel whoami --token "$VERCEL_TOKEN" 2>/dev/null || echo "Will login with token..."

# Link and deploy
echo ""
echo "📤 Deploying to Vercel..."
cd /home/awcreator/workspace/am-creator-analytics

vercel --token "$VERCEL_TOKEN" --prod --yes \
  -e DATABASE_URL="$DATABASE_URL" \
  -e NEXTAUTH_URL="https://your-app.vercel.app" \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  -e OPENSIGN_API_KEY="$OPENSIGN_API_KEY" \
  -e NANGO_SERVER_URL="$NANGO_SERVER_URL" \
  -e NANGO_SECRET_KEY="$NANGO_SECRET_KEY" \
  -e STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
  -e STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployed successfully!"
  echo "🌐 Your app is live at: https://your-app.vercel.app"
  echo ""
  echo "📌 Next steps:"
  echo "1. Set up environment variables in Vercel dashboard"
  echo "2. Update OpenSign webhook URL"
  echo "3. Update Stripe webhook URL"
else
  echo ""
  echo "❌ Deployment failed. Try:"
  echo "1. Make sure Vercel CLI is installed: npm i -g vercel"
  echo "2. Make sure token is valid: https://vercel.com/account/tokens"
  echo "3. Set environment variables first in Vercel dashboard"
fi
