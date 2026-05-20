#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 🚀 ONE-COMMAND DEPLOY — Bhidy App
# Usage: ./deploy.sh
#        ./deploy.sh --news-only    (just run news scraper)
#        ./deploy.sh --skip-news    (skip news, just build & deploy)
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()   { echo -e "${GREEN}✅${NC} $1"; }
warn() { echo -e "${YELLOW}⚠️${NC} $1"; }
err()  { echo -e "${RED}❌${NC} $1"; exit 1; }

# ─── Parse arguments ─────────────────────────────────────────
NEWS_ONLY=false; SKIP_NEWS=false
for arg in "$@"; do
  case $arg in
    --news-only) NEWS_ONLY=true ;;
    --skip-news) SKIP_NEWS=true ;;
  esac
done

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  🚀 Bhidy App Deploy  $(date '+%Y-%m-%d %H:%M')     ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

# ─── Step 1: News Scraper (optional) ─────────────────────────
if [ "$NEWS_ONLY" = true ]; then
  log "Running news scraper..."
  node backend/jobs/newsScraper.js && node restore_news.cjs
  ok "News scraped!"
  git add public/data/news_*.json && git commit -m "📰 Manual news update" && git push
  ok "News data pushed to GitHub"
  exit 0
fi

if [ "$SKIP_NEWS" = false ]; then
  log "Scraping fresh news..."
  node backend/jobs/newsScraper.js && node restore_news.cjs || warn "News scraper failed (non-critical)"
fi

# ─── Step 2: Build ───────────────────────────────────────────
log "Building production bundle..."
npm run build
ok "Build complete"

# ─── Step 3: Wrangler Auth Check + Deploy ────────────────────
log "Checking Cloudflare authentication..."

if npx wrangler whoami 2>/dev/null | grep -q "You are logged in"; then
  ok "Already authenticated with Cloudflare"
else
  warn "Not authenticated with Cloudflare — starting login..."
  echo ""
  echo -e "${YELLOW}  A browser will open. Log in to your Cloudflare account.${NC}"
  echo -e "${YELLOW}  (This only needs to happen once — token is saved locally)${NC}"
  echo ""
  npx wrangler login
  ok "Authentication complete!"
fi

# ─── Step 4: Deploy to Cloudflare Pages ──────────────────────
log "Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=bhidy-app --commit-dirty=true

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
ok "DEPLOYMENT COMPLETE!"
echo -e "${CYAN}  🌍 App:     https://bhidy-app.pages.dev${NC}"
echo -e "${CYAN}  🔧 Admin:   https://bhidy-app.pages.dev/admin${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

# ─── Step 5: Push code to GitHub ─────────────────────────────
log "Pushing code to GitHub..."
git add -A
git diff --staged --quiet || git commit -m "🚀 Deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin main
ok "Code pushed to GitHub"
