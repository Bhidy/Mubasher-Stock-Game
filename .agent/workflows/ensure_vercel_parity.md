---
description: Process to ensure Vercel production environment matches Localhost development features.
---

# Vercel vs Localhost Parity Process

This workflow defines the steps to ensure that the Vercel (Production) environment has feature parity with the Localhost (Development) environment. **This is CRITICAL because Vercel runs Serverless Functions (`api/*.js`), while Localhost runs a persistent Express server (`backend/server.js`). Updates to one do NOT automatically apply to the other.**

## "The Rule of Two"
Every time you modify logic in `backend/` (Local), you must explicitly verify and update the corresponding file in `api/` (Vercel).

| Feature | Local File | Vercel File | Parity Check |
| :--- | :--- | :--- | :--- |
| **Stocks** | `backend/jobs/updateStockPrices.js` | `api/stocks.js` | Ensure same Ticker Lists & Object Fields |
| **News** | `backend/jobs/newsScraper.js` | `api/news.js` | Ensure same Sources & Translation Logic |
| **Charts** | `backend/server.js` (logic) | `api/chart.js` | Ensure same Range options & Fallbacks |

## 1. News & Translation Protocol
If you update the news scraper locally:
1.  **Sources**: Check if Vercel `api/news.js` is fetching from the same sources (e.g., Bing RSS, Google News).
    - *Note*: Vercel cannot run Puppeteer/Cheerio easily. Prefer Bing RSS for Vercel.
2.  **Translation**: If Local uses a translation library or API, Vercel MUST have a corresponding `translateText` function within `api/news.js`.
    - Verify `api/news.js` has: `async function translateText(text) { ... }`
3.  **Caching**: Local uses memory cache. Vercel MUST use `res.setHeader('Cache-Control', 's-maxage=300')`.

## 2. Stock Data Consistency
1.  **Ticker Sync**: Copy the `SAUDI_STOCKS`, `EGYPT_STOCKS`, and `GLOBAL_TICKERS` arrays from `backend/jobs/updateStockPrices.js` to `api/stocks.js`.
2.  **Meta Sync**: Ensure `GLOBAL_META` (names, countries, sectors) matches exactly.
3.  **Field Check**: Ensure the returned JSON object in `mapStockData` has the exact same keys (e.g., `regularMarketPrice`, `change`, `volume`).

## 3. Migration Checklist (Local -> Vercel)
When moving a "Local" feature to "Vercel":

- [ ] **No Cron Jobs**: Convert background updates to *on-request* updates with caching.
- [ ] **Timeout Handling**: Vercel functions time out after 10-60s. Use `Promise.race` with a 4-5s timeout for all external calls.
- [ ] **Dependencies**: If you add a package (e.g., `rss-parser`) to `backend/package.json`, you MUST add it to the root `package.json` for Vercel to install it.

## 4. Final Deployment Validation
1.  Push to main/master.
2.  Verify Vercel Deployment status is "Ready".
3.  **Manual Test**:
    - Visit `https://[your-app].vercel.app/api/news?market=SA`
    - Check: Are titles in English? Are sources like Argaam present?
    - Visit `https://[your-app].vercel.app/api/stocks?market=EG`
    - Check: are all EGX30 stocks present?

## 5. Frontend Compatibility (CRITICAL)
**NEVER use hardcoded `http://localhost:5001` in `src/` files.**
- **Why?** It breaks the app on mobile devices and real production deployments.
- **Rule**: ALWAYS use relative paths (e.g., `/api/news`) in `fetch` calls.
- **Check**: Before deploying, search the codebase for `localhost:5001`. If found, FIX IT.

---
**Status**: Active Protocol. Use this for all future backend updates.
