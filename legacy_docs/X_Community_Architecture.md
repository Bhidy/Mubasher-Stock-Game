# 🧠 X Community Engine: How It Works

This document explains the technical architecture behind the X Community "Market Intelligence" feature.

## 1. The Challenge
We have **247 Target Accounts** (Elite Analysts, Banks, News).
*   **Problem**: Twitter/X does not allow us to fetch 247 profiles instantly. It would take ~2 minutes and likely get blocked.
*   **Vercel Limit**: Vercel Serverless Functions have a strict **30-second timeout**. If a request takes 30.1s, the app crashes ("White Page").

## 2. The Solution: "Smart Sampling"
Instead of fetching everyone at once, we use a **Rolling Sample Strategy**:

1.  **The Shuffle**: Every time you refresh, the server randomly shuffles the full list of 247 accounts.
2.  **The Sample**: We pick the top **60 accounts** from this shuffled list.
    *   *Why 60?* Fetching 60 accounts takes ~15-20 seconds, which is safe for Vercel's 30s limit.
3.  **The Fetch**: We download the latest tweets for these 60 accounts in parallel batches (10 at a time).

## 3. The "Memory Engine" (Cumulative Cache)
To ensure we don't lose data, the backend has a short-term memory:

*   **Step A**: User 1 loads the page. Server fetches Group A (60 accounts).
*   **Step B**: Server *saves* these tweets to a "Cache".
*   **Step C**: User 1 refreshes (or User 2 visits). Server fetches Group B (different 60 accounts).
*   **Step D**: Server **MERGES** Group B with the cached Group A.
    *   *Result*: The dashboard now shows insights from ~120 accounts, even though we only fetched 60 just now.
    *   *Limit*: We keep the last 100 tweets per user to prevent the file from getting too big.

## 4. The Intelligence Layer
Once we have the tweets (Mixed Live + Cached), we run them through the **Intelligence Processor**:

*   **Filter**: Discards lifestyle posts (e.g., "Good morning", "Coffee"). Keeps only posts with keywords like *Price, Chart, Dividend, Support, TASI*.
*   **Sentiment**: Scans for bullish words (*Breakout, Buy, Green*) vs bearish words (*Crash, Sell, Red*).
*   **Ticker Detection**: Converts numbers (`2222`) to Names (`Aramco`) and counts mentions to find "Trending Tickers".

## 5. Common Errors & Fixes
| Error | Meaning | Cause | Fix |
| :--- | :--- | :--- | :--- |
| **White Page** | Frontend Crash | The API took >30s and timed out (504 Error). | We reduced sample size to 60. |
| **Failed to Fetch** | Network Error | API crashed or Internet is down. | Retry; Server logs usually show why. |
| **No Tweets Found** | Empty Data | The filter was too strict and removed everything. | We added "Elite" exceptions. |
