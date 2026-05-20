# 🚀 Bhidy App — Setup & Operations Guide

## Architecture (Simple)

```
GitHub Repo ──push──► GitHub Actions ──► Cloudflare Pages (live app)
                              │
                    (every 10 min cron)
                              │
                         News Scraper
                              │
                    public/data/news_*.json  ◄── Edge Function reads this
```

**One platform. One database. No complexity.**

---

## First-Time Setup (One-Time)

### 1. Add GitHub Secrets for Auto-Deploy

Go to: **GitHub → Bhidy/Mubasher-Stock-Game → Settings → Secrets → Actions → New secret**

Add these 2 secrets:

| Secret Name | Where to find it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | [dash.cloudflare.com](https://dash.cloudflare.com/profile/api-tokens) → Create Token → "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | [dash.cloudflare.com](https://dash.cloudflare.com) → Right sidebar → Account ID |

**After this, every `git push` auto-deploys the app.** ✅

---

## Daily Operations

### Deploy (after making changes)
```bash
./deploy.sh
```
That's it. One command. Done.

### Quick news refresh only
```bash
./deploy.sh --news-only
```

### Deploy without re-scraping news
```bash
./deploy.sh --skip-news
```

---

## Live URLs

| URL | Purpose |
|---|---|
| https://bhidy-app.pages.dev | Main app (player) |
| https://bhidy-app.pages.dev/admin | Admin / CMS backend |
| https://bhidy-app.pages.dev/admin/ai-dashboard | AI News Generator |
| https://bhidy-app.pages.dev/admin/news | Manage & publish articles |

---

## How News Works

1. **Automated (every 10 min):** GitHub Actions scrapes Argaam, Mubasher, Aleqt → saves to `public/data/news_SA.json`
2. **Edge Function** (`/api/news?market=SA`): Reads directly from GitHub — always fresh, never stale
3. **AI News:** Admin generates articles in `/admin/ai-dashboard` → saves as drafts → publish in `/admin/news`
4. **Player app:** Automatically shows both scraped + published AI articles, refreshes every 60 seconds

---

## AI News Workflow

1. Go to `/admin/ai-dashboard` → Click **"Start AI Generation"**
2. AI reads scraped articles, rewrites them in Arabic
3. Articles appear as **drafts** in `/admin/news`
4. Click **Edit** → toggle **Published: Yes** → Save
5. Article immediately appears in the player news feed ✅

---

## Troubleshooting

| Issue | Fix |
|---|---|
| News is stale | Check GitHub Actions → "🚀 CI/CD Pipeline" → is the schedule running? |
| AI generation not working | Check `/admin/ai-dashboard` → verify "Source Pool" count is > 0 |
| Deploy fails | Run `./deploy.sh` → it will open browser to re-authenticate if needed |
| App shows old code | GitHub Actions deploy job may be pending — wait 2 min or run `./deploy.sh` |

---

## Architecture Decisions

- **No Vercel** — all APIs run as Cloudflare Edge Functions (faster, cheaper, simpler)
- **No KV caching for news** — edge function reads GitHub directly (no stale data possible)
- **CMS persists in JSONBlob** — simple, reliable, no database setup needed
- **News scraped to GitHub** — public, free, always accessible from any edge location
