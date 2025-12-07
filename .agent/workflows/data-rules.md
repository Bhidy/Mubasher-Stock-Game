---
description: Critical rules for handling prices and market data in the app
---

# CRITICAL DATA RULES - MUST FOLLOW ALWAYS

## Rule 1: NO HARDCODED/MOCK DATA
- **ALL prices, market data, stock information must come from real APIs**
- Never use hardcoded arrays with fake prices (e.g., `{ name: 'S&P 500', value: 5234.12 }`)
- Never use placeholder/mock values for any financial data
- If an API doesn't provide certain data, show "N/A" or hide the section - don't fake it

## Rule 2: REAL-TIME UPDATES
- All price data must refresh automatically (currently every 5 seconds)
- Use the `usePrices()` hook from `src/context/PriceContext.jsx` for all price data
- Backend fetches from Yahoo Finance API via `backend/jobs/updateStockPrices.js`

## Rule 3: DATA SOURCES
- **Saudi Stocks**: Yahoo Finance (`*.SR` tickers)
- **TASI Index**: Yahoo Finance (`^TASI.SR`)
- **Global Indices**: Yahoo Finance (`^GSPC`, `^DJI`, `^IXIC`, `^FTSE`, `^GDAXI`, `^N225`, `BZ=F`, `GC=F`)
- **Stock Fundamentals**: Yahoo Finance quoteSummary (P/E, EPS, Market Cap, Dividend Yield, etc.)

## Rule 4: WHEN ADDING NEW DATA
1. First check if the data is available from Yahoo Finance API
2. Add the ticker/field to `backend/jobs/updateStockPrices.js`
3. Update `getStocks()` to include the new field in the response
4. Consume in frontend via `usePrices()` hook
5. Never hardcode values as "examples" or "placeholders"

## Rule 5: SECTOR DATA
- Sector performance should be CALCULATED from actual stock data, not hardcoded
- Group stocks by their sector (available from Yahoo Finance)
- Calculate average change per sector from real stock prices

## Rule 6: THIS IS A PRODUCTION APP
- Real users will see this data
- Inaccurate data damages trust
- Always prioritize data accuracy over visual completeness
- If data is unavailable, hide the section rather than show fake data

## Rule 7: NUMBER FORMATTING
- **ALL prices must show exactly 2 decimal places** (use `.toFixed(2)`)
- **ALL change percentages must show exactly 2 decimal places** (use `.toFixed(2)`)
- Use `toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })` for prices with commas
- Examples:
  - Price: `24.50 SAR` not `24.5` or `24.503`
  - Change: `+1.25%` not `+1.25345678%`
  - Index value: `6,857.12` not `6857.123456`

## Files to Check for Mock Data
- `src/screens/MarketSummary.jsx` - Sectors tab
- `src/screens/Pick.jsx` - Stock prices
- `src/screens/Live.jsx` - Stock prices  
- `src/screens/Home.jsx` - Any market stats
- `src/screens/CompanyProfile.jsx` - Company data
- `src/components/StockCard.jsx` - Price display

## Backend Data Flow
```
Yahoo Finance API
      ↓
backend/jobs/updateStockPrices.js (fetches every 5s)
      ↓
backend/data/stocks.json (cache)
      ↓
GET /api/stocks endpoint
      ↓
src/context/PriceContext.jsx (polls every 5s)
      ↓
usePrices() hook in components
```
