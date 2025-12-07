---
description: Full QA and Deployment Verification Process - Run before confirming any changes
---

# Professional QA & Deployment Workflow

**Philosophy**: Act like a full software team (Development, QA, DevOps, Support). Never confirm a feature works until it's verified. Apply best practices from Apple, Google, and Microsoft.

## Pre-Deployment Checklist

// turbo-all

### 1. Build Verification
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No critical warnings (acceptable: chunk size warnings)

### 2. API Endpoint Testing (Localhost)

**Stocks API:**
```bash
curl -s "http://localhost:5001/api/stocks?market=SA" | head -c 500
curl -s "http://localhost:5001/api/stocks?market=EG" | head -c 500
curl -s "http://localhost:5001/api/stocks?market=Global" | head -c 500
```
✅ Verify: Each returns ONLY stocks for that specific market

**News API:**
```bash
curl -s "http://localhost:5001/api/news?market=US" | head -c 1000
curl -s "http://localhost:5001/api/news?market=SA" | head -c 1000
curl -s "http://localhost:5001/api/news?market=EG" | head -c 1000
```
✅ Verify: Returns fresh news with valid titles, links, and timestamps

**Chart API:**
```bash
curl -s "http://localhost:5001/api/chart?symbol=AAPL&range=1D" | head -c 500
curl -s "http://localhost:5001/api/chart?symbol=2222.SR&range=1D" | head -c 500
```
✅ Verify: Returns quotes array with date and price

**Content Extraction API:**
```bash
curl -s "http://localhost:5001/api/news/content?url=https://finance.yahoo.com/news/..." | head -c 1000
```
✅ Verify: Returns `content` field with HTML paragraphs or fallback link

**Translation API:**
```bash
curl -X POST "http://localhost:5001/api/translate" -H "Content-Type: application/json" -d '{"text":"Hello World","targetLang":"ar"}'
```
✅ Verify: Returns `translatedText` in Arabic

### 3. Visual QA (Browser Testing)

Open: `http://localhost:5173`

| Page | Test | Expected |
|------|------|----------|
| Home/Market Summary | Load time | < 3 seconds |
| Market Summary | SA Tab | Saudi stocks with TASI |
| Market Summary | EG Tab | Egypt stocks with EGX 30 |
| Market Summary | US Tab | US indices and stocks |
| Market Summary | Chart | Displays chart for selected index |
| News Feed | Load | Shows fresh news cards with images |
| News Article | Click article | Full content or "Read on source" link |
| News Article | Translate button | Translates to Arabic |
| Stock Analysis | Open any stock | All tabs show data (not N/A) |

### 4. Vercel Parity Check

After `git push`, wait 2 minutes then:

```bash
curl -s "https://bhidy.vercel.app/api/stocks?market=SA" | head -c 500
curl -s "https://bhidy.vercel.app/api/news?market=US" | head -c 500
curl -s "https://bhidy.vercel.app/api/chart?symbol=AAPL&range=1D" | head -c 500
```

✅ Verify: Same structure and fresh data as localhost

### 5. Mobile Device Testing

On iPhone/Android:
- Open `https://bhidy.vercel.app/market`
- ✅ Page loads without blank screen
- ✅ Charts display (not "No chart available")
- ✅ News loads with images
- ✅ Prices update (pull to refresh or wait 15s)

### 6. Cross-Page Consistency (CRITICAL)

**NEWS CONSISTENCY:**
```bash
# Compare news on Market Summary vs News Feed for same market
# They MUST show the same articles
```
- [ ] Open Market Summary -> Saudi tab -> Note first 3 news titles
- [ ] Open News Feed -> Saudi -> Verify SAME titles appear
- [ ] Repeat for Egypt and US markets
- [ ] If different: BUG - The data sources are not unified

**STOCK DATA CONSISTENCY:**
- [ ] Stock prices on Market Summary match Stock Analysis page
- [ ] Top Movers percentages match actual stock data

### 7. Vercel vs Localhost Parity

**After every deploy, compare:**
```bash
# Localhost
curl -s "http://localhost:5001/api/news?market=US" | jq '.[0].title'

# Vercel
curl -s "https://bhidy.vercel.app/api/news?market=US" | jq '.[0].title'
```
✅ Both should return similar news (same sources, same freshness)

**If different:**
- Check if `api/news.js` (Vercel) matches `backend/server.js` (localhost) logic
- Ensure same Yahoo Finance queries are used in both

## Post-Deployment Monitoring

1. **Check Vercel Logs**: Look for any 500 errors or timeouts
2. **User Feedback**: If user reports issue, reproduce first before fixing
3. **Data Freshness**: Prices should match real market within 1 minute

## Critical Rules

1. **NEVER use hardcoded `localhost:5001` in frontend code**
2. **ALWAYS test both localhost AND Vercel before confirming**
3. **If an API fails, check BOTH `backend/server.js` AND `api/*.js`**
4. **Run `npm run build` before every deploy**
5. **Restart backend server after modifying `backend/server.js`**

---
**Status**: Active Protocol. Use this for ALL changes.
