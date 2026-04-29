#!/bin/bash
# AM Creator Analytics - Push to GitHub Script
# Run this after creating a GitHub repo

echo "🚀 AM Creator Analytics - Push to GitHub"
echo "======================================"
echo ""
echo "📌 INSTRUCTIONS:"
echo "1. Go to https://github.com/new"
echo "2. Create a NEW repo named: am-creator-analytics"
echo "3. DO NOT initialize with README, .gitignore, or license"
echo "4. Copy the repo URL (SSH or HTTPS)"
echo ""

read -p "Enter your GitHub repo URL (e.g., git@github.com:username/am-creator-analytics.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ No URL provided. Exiting."
  exit 1
fi

echo ""
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin master

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo "🌐 View your repo at: ${REPO_URL%.git}"
else
  echo ""
  echo "❌ Push failed. Make sure:"
  echo "   - You created the repo on GitHub"
  echo "   - Your SSH key is added to GitHub (or use HTTPS + token)"
  echo "   - The repo name matches"
fi
