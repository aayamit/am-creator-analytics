#!/bin/bash
# AM Creator Analytics - Setup Script
# Run this to: 1) Fix dev server, 2) Set up GitHub, 3) Push code

set -e  # Exit on error

echo "🚀 AM Creator Analytics - Setup Script"
echo "================================="

# Step 1: Kill all existing processes
echo ""
echo "📴 Step 1: Killing existing processes..."
pkill -9 -f "next" 2>/dev/null || true
pkill -9 -f "node.*next" 2>/dev/null || true
sleep 2
echo "✅ Processes killed"

# Step 2: Clear caches
echo ""
echo "🧹 Step 2: Clearing caches..."
cd /home/awcreator/workspace/am-creator-analytics
rm -rf .next
rm -rf node_modules/.cache
echo "✅ Caches cleared"

# Step 3: Check environment
echo ""
echo "🔍 Step 3: Checking environment..."
if [ ! -f ".env" ]; then
  echo "⚠️  .env file not found. Creating from .env.example..."
  cp .env.example .env
  echo "✏️  Please edit .env with your credentials:"
  echo "   - DATABASE_URL"
  echo "   - NEXTAUTH_SECRET (32+ chars)"
  echo "   - STRIPE_SECRET_KEY (for payouts)"
  echo "   - OPENSIGN_API_KEY (for contracts)"
  echo "   - NANGO_SECRET_KEY (for CRM sync)"
fi

# Step 4: Set up GitHub remote (REPLACE WITH YOUR REPO URL)
echo ""
echo "📂 Step 4: Setting up GitHub..."
echo "⚠️  REPLACE 'YOUR_GITHUB_REPO_URL' with your actual repo URL!"
echo "   Example: git@github.com:yourusername/am-creator-analytics.git"
read -p "Enter your GitHub repo URL (or press Enter to skip): " REPO_URL

if [ ! -z "$REPO_URL" ] && [ "$REPO_URL" != "YOUR_GITHUB_REPO_URL" ]; then
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REPO_URL"
  echo "✅ GitHub remote added: $REPO_URL"
else
  echo "⚠️  Skipped GitHub setup. Run manually:"
  echo "   git remote add origin YOUR_GITHUB_REPO_URL"
fi

# Step 5: Push to GitHub
echo ""
echo "📤 Step 5: Pushing to GitHub..."
if git remote -v | grep -q origin; then
  git push -u origin master 2>&1 || echo "⚠️  Push failed. Check your credentials and repo URL."
else
  echo "⚠️  No remote set. Skipping push."
fi

# Step 6: Start dev server (with Turbopack disabled)
echo ""
echo "🚀 Step 6: Starting dev server..."
echo "   (Turbopack disabled in next.config.ts)"
echo ""
echo "🌐 Server will start at http://localhost:3000"
echo "   Admin: http://localhost:3000/cmojiqbw80000h6f000mf7jkx/dashboard/admin"
echo ""

# Start without Turbopack
npm run dev -- --no-turbopack 2>&1 | tee /tmp/nextjs-dev.log

echo ""
echo "✅ Setup complete!"
