#!/bin/bash
echo "🚀 Starting Deployment to stock-hero-backend.hetzner.app..."

ssh -t root@stock-hero-backend.hetzner.app "
  echo '📂 Navigating to project...'
  cd stock-hero-backend && \
  
  echo '⬇️  Pulling latest code...'
  git pull && \
  
  echo '📦 Installing dependencies...'
  npm install --production && \
  
  echo '🗄️  Running Database Migrations...'
  psql -U postgres -d mubasher_stock_game -f migrations/002_add_cache_tables.sql && \
  
  echo '🔄 Restarting Backend Service...'
  pm2 restart stock-hero-backend && \
  
  echo '👷 Starting Ingestion Worker...'
  pm2 start workers/ingest_worker.js --name stock-hero-ingest --cron '*/5 * * * *' --no-autorestart || pm2 restart stock-hero-ingest
  
  echo '✅ Deployment SUCCESSFUL! API is now Hardened.'
"
