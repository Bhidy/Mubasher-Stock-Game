# API Parity Prevention Plan

## Problem Identified (2025-12-20)
The AI Stock Movement "Why is X moving today?" feature was showing zeros and broken data because:
1. **Two separate API implementations exist:**
   - `/api/ai-insight.js` - Vercel serverless (correct, full implementation)
   - `/functions/api/ai-insight.js` - Cloudflare Pages (was a mock placeholder!)
2. The Cloudflare function returned a different response format than the frontend expected

## Root Cause
- When deploying to Cloudflare Pages, functions in `/functions/api/` are used
- When deploying to Vercel, functions in `/api/` are used  
- The developer forgot to keep these in sync

## Fixes Applied
1. ✅ Updated `/functions/api/ai-insight.js` to match the Vercel implementation
2. ✅ Fixed response format to match what `StockMovementCard.jsx` expects:
   ```json
   {
     "symbol": "AAPL",
     "answer": "Apple is advancing (1.25%) today...",
     "sources": [...],
     "timestamp": "..."
   }
   ```

## Prevention Strategies

### 1. **Single Source of Truth** 
Create a shared utilities layer that both Vercel and Cloudflare functions can import from.

### 2. **API Contract Tests**
Add automated tests that verify:
- Both `/api/*.js` and `/functions/api/*.js` return the same response schema
- Response format matches what frontend components expect

### 3. **Pre-Deploy Checklist**
Before any deployment:
- [ ] Check if `/api/` was modified
- [ ] If yes, update corresponding `/functions/api/` file
- [ ] Verify response formats match frontend expectations

### 4. **API Endpoints Inventory**

| Endpoint | Vercel Path | Cloudflare Path | Status |
|----------|-------------|-----------------|--------|
| ai-insight | `/api/ai-insight.js` | `/functions/api/ai-insight.js` | ✅ Fixed |
| stock-profile | `/api/stock-profile.js` | `/functions/api/stock-profile.js` | ⚠️ Check |
| stocks | `/api/stocks.js` | `/functions/api/stocks.js` | ⚠️ Check |
| chart | `/api/chart.js` | `/functions/api/chart.js` | ⚠️ Check |
| news | `/api/news.js` | `/functions/api/news.js` | ⚠️ Check |
| cms | `/api/cms.js` | `/functions/api/cms.js` | ⚠️ Check |

### 5. **Future Architecture Recommendation**
Consider consolidating to a single deployment target (Vercel OR Cloudflare) to avoid maintaining two sets of API functions.

## Immediate Actions Needed
1. Audit all `/functions/api/*.js` files to ensure they're not mocks
2. Create a sync script to copy Vercel API logic to Cloudflare format
3. Consider using Vercel as the primary API source and proxying from Cloudflare if needed
