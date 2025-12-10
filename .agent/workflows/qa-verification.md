---
description: Full QA and Deployment Verification Process - Run before confirming any changes
---

# QA Verification Workflow

This workflow performs comprehensive QA testing for all backend and frontend features.

## Backend API Tests

// turbo-all

1. **Test CMS Entities**
```bash
echo "=== CMS API Tests ===" && \
curl -s "https://bhidy-app.pages.dev/api/cms?entity=lessons" | head -100 && \
curl -s "https://bhidy-app.pages.dev/api/cms?entity=notifications" | head -100 && \
curl -s "https://bhidy-app.pages.dev/api/cms?entity=dashboard" | head -100
```

2. **Test Market Data APIs**
```bash
echo "=== Market Data Tests ===" && \
curl -s "https://bhidy-app.pages.dev/api/stocks?market=SA" | head -50 && \
curl -s "https://bhidy-app.pages.dev/api/stocks?market=EG" | head -50 && \
curl -s "https://bhidy-app.pages.dev/api/stocks?market=US" | head -50
```

3. **Test News API**
```bash
curl -s "https://bhidy-app.pages.dev/api/news?market=SA" | head -100
```

## Frontend Verification

After running the above, manually verify in browser:

- [ ] `https://bhidy-app.pages.dev/` → Redirects to `/player/home`
- [ ] `https://bhidy-app.pages.dev/player/home` → Shows Player Mode UI
- [ ] `https://bhidy-app.pages.dev/investor/home` → Shows Investor Mode UI (no white screen)
- [ ] `https://bhidy-app.pages.dev/admin` → Shows Admin Dashboard with sidebar
- [ ] `https://bhidy-app.pages.dev/admin/lessons` → Shows lessons list
- [ ] `https://bhidy-app.pages.dev/admin/notifications` → Shows notifications panel

## Expected Results

| Endpoint | Expected |
|---|---|
| `/api/cms?entity=lessons` | JSON array with 7+ lessons |
| `/api/cms?entity=notifications` | JSON array (not 400 error) |
| `/api/cms?entity=dashboard` | JSON with stats object |
| `/api/stocks?market=SA` | 30+ Saudi stocks |
| `/api/stocks?market=EG` | 15+ Egypt stocks |
| `/api/stocks?market=US` | 20+ US stocks |

## If Any Test Fails

1. Check browser console for JavaScript errors
2. Check Network tab for failed API calls
3. If CMS fails: Check JSONBlob connectivity
4. If stocks fail: Check Vercel proxy configuration
5. Run `npm run build` locally to catch compile errors
