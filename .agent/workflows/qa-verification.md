---
description: Full QA and Deployment Verification Process - Run before confirming any changes
---

# Professional QA & Deployment Workflow

**Philosophy**: Act like a full software team (Development, QA, DevOps, Support). Never confirm a feature works until it's FULLY verified. Apply best practices from Apple, Google, and Microsoft.

## MANDATORY: Run This BEFORE Confirming ANY Change

// turbo-all

### 1. Build Verification
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No critical warnings

### 2. Restart Backend (If server.js modified)
```bash
# Kill old server and restart
lsof -ti:5001 | xargs kill -9
cd backend && npm start
```

### 3. API Endpoint Testing (ALL Markets)

**Stocks API:**
```bash
curl -s "http://localhost:5001/api/stocks?market=SA" | head -c 300
curl -s "http://localhost:5001/api/stocks?market=EG" | head -c 300
curl -s "http://localhost:5001/api/stocks?market=Global" | head -c 300
```
✅ Verify:
- [ ] SA returns only `.SR` stocks with correct names (NOT "EGX 30")
- [ ] EG returns only `.CA` stocks with correct names
- [ ] Global returns US/World stocks

**News API:**
```bash
curl -s "http://localhost:5001/api/news?market=US" | head -c 500
curl -s "http://localhost:5001/api/news?market=SA" | head -c 500
curl -s "http://localhost:5001/api/news?market=EG" | head -c 500
```
✅ Verify:
- [ ] Returns fresh news (check timestamps)
- [ ] Has valid titles and links
- [ ] Thumbnails are present

**Chart API:**
```bash
curl -s "http://localhost:5001/api/chart?symbol=AAPL&range=1D" | head -c 300
curl -s "http://localhost:5001/api/chart?symbol=2222.SR&range=1D" | head -c 300
curl -s "http://localhost:5001/api/chart?symbol=COMI.CA&range=1D" | head -c 300
```
✅ Verify:
- [ ] Returns quotes array with date and price
- [ ] No empty arrays or errors

**Content Extraction API:**
```bash
curl -s "http://localhost:5001/api/news/content?url=https://finance.yahoo.com/news/test" | head -c 300
```
✅ Verify:
- [ ] Returns `content` field (not error)

**Translation API:**
```bash
curl -X POST "http://localhost:5001/api/translate" -H "Content-Type: application/json" -d '{"text":"Hello","targetLang":"ar"}'
```
✅ Verify:
- [ ] Returns Arabic text

### 4. Cross-Page Consistency (CRITICAL)

**NEWS MUST BE IDENTICAL:**
- [ ] Open Market Summary -> Select SA -> Note first 3 news titles
- [ ] Open News Feed -> Select SA -> MUST show SAME titles
- [ ] Repeat for EG market
- [ ] Repeat for US market
- [ ] **If different = BUG - DO NOT DEPLOY**

**STOCK DATA MUST BE IDENTICAL:**
- [ ] Stock price on Market Summary = Stock price on Stock Analysis page
- [ ] Top Movers % = Actual change % in stock data

**CHARTS MUST WORK:**
- [ ] Chart on Market Summary loads
- [ ] Chart on Stock Analysis page loads
- [ ] Both show same direction (up/down)

### 5. Vercel Parity Check (After git push)

Wait 2 minutes for Vercel deployment, then:

```bash
# Compare Localhost vs Vercel
echo "=== LOCALHOST ===" && curl -s "http://localhost:5001/api/news?market=US" | head -c 200
echo "=== VERCEL ===" && curl -s "https://bhidy.vercel.app/api/news?market=US" | head -c 200
```
✅ Verify:
- [ ] Same news source types (Yahoo Finance)
- [ ] Similar freshness
- [ ] No errors on Vercel

### 6. Mobile Device Testing

On iPhone/Android (Safari Private Mode):
- [ ] Open `https://bhidy.vercel.app/market`
- [ ] Page loads without blank screen
- [ ] Charts display (not "No chart available" or "Timeout")
- [ ] News loads with images
- [ ] Prices update automatically
- [ ] Can navigate to News Feed
- [ ] Can open a news article
- [ ] Article content displays (not just stub)

### 7. Full Feature Walkthrough

**Every page must be checked:**
- [ ] Home/Onboarding
- [ ] Market Summary (SA, EG, US tabs)
- [ ] Stock Analysis (open any stock)
- [ ] News Feed (all markets)
- [ ] News Article (open any article, check content loads)
- [ ] Translation (click Arabic button)
- [ ] Community page
- [ ] Academy page

### 8. Data Accuracy Verification

**Compare with real market:**
- [ ] Check a stock price (e.g., AAPL, 2222.SR) against Google/Yahoo
- [ ] Price should match within 1% (accounting for delay)
- [ ] If significantly different = BUG - Using stale/fallback data

## Post-Deployment Monitoring

1. **Check Vercel Logs**: Look for 500 errors or timeouts
2. **User Feedback**: If user reports issue, reproduce first
3. **Data Freshness**: Prices should match real market within 1 minute

## Critical Rules

1. **NEVER use hardcoded `localhost:5001` in frontend code**
2. **ALWAYS restart backend after modifying server.js**
3. **ALWAYS test BOTH localhost AND Vercel**
4. **ALWAYS compare pages that should show same data**
5. **ALWAYS run `npm run build` before deploy**
6. **NEVER confirm until ALL checks pass**

## Failure Protocol

If ANY check fails:
1. STOP - Do not confirm to user
2. FIX the issue
3. RE-RUN all checks
4. Only then confirm

---
**Status**: MANDATORY for all changes. No exceptions.
