#!/bin/bash
# Push to GitHub - Interactive Script
# Run: cd /home/awcreator/workspace/am-creator-analytics && bash push-now.sh

echo "🚀 AM Creator Analytics - Push to GitHub"
echo "======================================"
echo ""

# Check if remote exists
if git remote -v | grep -q origin; then
  echo "✅ Remote 'origin' already exists:"
  git remote -v
  echo ""
  read -p "Do you want to remove and re-add origin? (y/n): " REMOVE
  if [ "$REMOVE" = "y" ]; then
    git remote remove origin
    echo "✅ Removed old origin"
  else
    echo "ℹ️  Keeping existing remote. Attempting push..."
    git push -u origin master
    exit $?
  fi
fi

echo "📌 To push to GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Create repo named: am-creator-analytics"
echo "3. DO NOT initialize with README/LICENSE"
echo ""

read -p "Enter your GitHub username: " USERNAME

if [ -z "$USERNAME" ]; then
  echo "❌ Username cannot be empty"
  exit 1
fi

REPO_URL="git@github.com:${USERNAME}/am-creator-analytics.git"

echo ""
echo "🔗 Using repo URL: $REPO_URL"
echo ""

git remote add origin "$REPO_URL"

echo "📤 Pushing 17 commits to GitHub..."
git push -u origin master

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo "🌐 View your repo at: https://github.com/${USERNAME}/am-creator-analytics"
else
  echo ""
  echo "❌ Push failed. Try:"
  echo "  1. Make sure you created the repo on GitHub"
  echo "  2. Make sure your SSH key is added to GitHub"
  echo "  3. Or use HTTPS URL with personal access token"
fi
