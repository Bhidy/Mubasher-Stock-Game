#!/bin/bash

# Enterprise-Grade Deployment Script with Auto-Retry
# Prevents "Unknown internal error" from stopping the workflow

MAX_RETRIES=3
RETRY_COUNT=0
PROJECT_NAME="bhidy-app"
BRANCH="main"

echo "🚀 Starting Enterprise Deployment for $PROJECT_NAME..."

# 1. Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting."
    exit 1
fi

# 2. Deploy with Retry Logic
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    echo "☁️  Deploying to Cloudflare (Attempt $(($RETRY_COUNT + 1))/$MAX_RETRIES)..."
    
    npx wrangler pages deploy ./dist --project-name=$PROJECT_NAME --commit-dirty=true
    
    # Check if deployment succeeded
    if [ $? -eq 0 ]; then
        echo "✅ Deployment SUCCESSFUL!"
        echo "🌍 Live at: https://$PROJECT_NAME.pages.dev"
        exit 0
    else
        echo "⚠️  Deployment failed. Retrying in 5 seconds..."
        RETRY_COUNT=$(($RETRY_COUNT + 1))
        sleep 5
    fi
done

echo "❌ Deployment failed after $MAX_RETRIES attempts."
exit 1
