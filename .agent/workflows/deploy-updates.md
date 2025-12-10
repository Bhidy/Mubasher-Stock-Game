---
description: Standard deployment process for Cloudflare Pages
---

# Deploy Updates Workflow

This workflow deploys the latest code to Cloudflare Pages (`bhidy-app.pages.dev`).

## Prerequisites
- All changes committed to Git
- Build compiles without errors

## Steps

// turbo-all

1. **Verify Build Compiles Locally**
```bash
npm run build
```
If this fails, fix the errors before proceeding.

2. **Deploy to Cloudflare Pages**
```bash
npx wrangler pages deploy dist --project-name bhidy-app --commit-dirty=true
```

3. **Verify Deployment**
```bash
curl -s "https://bhidy-app.pages.dev/api/cms?entity=dashboard" | head -50
```
Should return JSON with stats.

4. **Commit Changes to Git**
```bash
git add . && git commit -m "Deploy: $(date +%Y-%m-%d)" && git push origin main
```

## Verification Checklist
- [ ] `/api/cms?entity=lessons` returns JSON array
- [ ] `/api/cms?entity=notifications` returns JSON (not 400)
- [ ] `/api/stocks?market=SA` returns stock data
- [ ] `/player/home` loads without white screen
- [ ] `/investor/home` loads without white screen
- [ ] `/admin` shows dashboard with sidebar

## Rollback
If deployment fails, redeploy the previous commit:
```bash
git revert HEAD && npm run build && npx wrangler pages deploy dist --project-name bhidy-app
```

## Architecture Notes
- **Frontend**: Cloudflare Pages (static SPA)
- **CMS API**: Cloudflare Workers (functions/api/cms.js) → JSONBlob
- **Market Data**: Proxied to Vercel (stocks, news, charts)
