# 🚀 Cloudflare Pages Migration Plan

> **Project:** Mubasher Stock Game  
> **Migration Date:** December 8, 2024  
> **Status:** 🟡 In Progress

---

## 📋 Pre-Migration Checklist

### Current Architecture Analysis
- [x] React 19 + Vite frontend
- [x] 11 serverless API functions in `/api`
- [x] Environment variables in `.env.local`
- [x] Yahoo Finance, Groq AI, X Twitter integrations

### Migration Scope
| Component | Current (Vercel) | Target (Cloudflare) | Migration Required |
|-----------|------------------|---------------------|-------------------|
| Frontend | Vite static build | Pages build | ✅ Simple |
| API Functions | `/api/*.js` | `/functions/*.js` | ✅ Convert format |
| Environment Vars | Vercel Dashboard | Wrangler/Dashboard | ✅ Re-configure |
| Domain | Vercel auto-domain | Cloudflare domain | ✅ New URL |
| Build Command | `vite build` | `vite build` | ✅ Same |
| Output Dir | `dist` | `dist` | ✅ Same |

---

## 🎯 Migration Steps

### Phase 1: Setup & Configuration ✓
- [ ] Install Wrangler CLI
- [ ] Create `wrangler.toml` configuration
- [ ] Create `/functions` directory for Cloudflare Workers

### Phase 2: API Function Conversion ✓
- [ ] Convert `api/prices.js` → `functions/api/prices.js`
- [ ] Convert `api/news.js` → `functions/api/news.js`
- [ ] Convert `api/x-community.js` → `functions/api/x-community.js`
- [ ] Convert `api/ai-insight.js` → `functions/api/ai-insight.js`
- [ ] Convert `api/chatbot.js` → `functions/api/chatbot.js`
- [ ] Convert `api/chart-data.js` → `functions/api/chart-data.js`
- [ ] Convert `api/stock-profile.js` → `functions/api/stock-profile.js`
- [ ] Convert `api/market-summary.js` → `functions/api/market-summary.js`
- [ ] Convert `api/search-stocks.js` → `functions/api/search-stocks.js`
- [ ] Convert `api/world-indices.js` → `functions/api/world-indices.js`
- [ ] Convert `api/translate.js` → `functions/api/translate.js`

### Phase 3: Environment Variables ✓
- [ ] Document all required env vars
- [ ] Create `.dev.vars` for local development
- [ ] Configure production vars in Cloudflare Dashboard

### Phase 4: Build & Test Locally ✓
- [ ] Run `npm run build`
- [ ] Test with `wrangler pages dev ./dist`
- [ ] Verify all API endpoints work
- [ ] Test frontend functionality

### Phase 5: Deploy to Cloudflare ✓
- [ ] Create Cloudflare Pages project
- [ ] Configure build settings
- [ ] Deploy production build
- [ ] Verify deployment

### Phase 6: QA & Verification ✓
- [ ] Test Market Pulse dashboard
- [ ] Test X Community feed
- [ ] Test News Feed (SA, EG, US)
- [ ] Test Company Profile pages
- [ ] Test AI Chatbot
- [ ] Test Arabic translation
- [ ] Performance comparison

---

## 📁 File Structure After Migration

```
/Users/home/Documents/Antigravity/
├── src/                          # Frontend (unchanged)
├── functions/                    # NEW: Cloudflare Workers
│   └── api/
│       ├── prices.js
│       ├── news.js
│       ├── x-community.js
│       ├── ai-insight.js
│       ├── chatbot.js
│       ├── chart-data.js
│       ├── stock-profile.js
│       ├── market-summary.js
│       ├── search-stocks.js
│       ├── world-indices.js
│       └── translate.js
├── api/                          # OLD: Vercel functions (keep for backup)
├── wrangler.toml                 # NEW: Cloudflare config
├── .dev.vars                     # NEW: Local env vars
└── package.json
```

---

## 🔧 Technical Notes

### Cloudflare Workers Format
```javascript
// Vercel format (OLD)
export default function handler(req, res) {
  res.status(200).json({ data: "hello" });
}

// Cloudflare Workers format (NEW)
export async function onRequest(context) {
  return new Response(JSON.stringify({ data: "hello" }), {
    headers: { "Content-Type": "application/json" }
  });
}
```

### Key Differences
| Vercel | Cloudflare |
|--------|------------|
| `req.query` | `new URL(request.url).searchParams` |
| `req.body` | `await request.json()` |
| `res.status(200).json()` | `return new Response()` |
| `process.env.VAR` | `context.env.VAR` |

---

## ⏱️ Estimated Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Setup | 10 min | ⏳ |
| Phase 2: Convert APIs | 30 min | ⏳ |
| Phase 3: Env Vars | 5 min | ⏳ |
| Phase 4: Local Test | 15 min | ⏳ |
| Phase 5: Deploy | 10 min | ⏳ |
| Phase 6: QA | 15 min | ⏳ |
| **Total** | **~85 min** | |

---

## 🚨 Rollback Plan

If migration fails:
1. Vercel deployment remains active
2. All original `/api` files preserved
3. Can redeploy to Vercel with: `npx vercel --prod`

---

*Document will be updated as migration progresses.*
