# Stock Hero: The Complete Ecosystem Report
## Comprehensive Feature & Specification Document
**Prepared For:** Executive Board & Strategic Partners
**Date:** December 20, 2025
**Status:** Live Production (v3.0)
**Confidentiality:** Internal Only

---

# 🚀 Executive Summary
Stock Hero is a dual-mode financial "Super App" that merges institutional-grade investment tools with high-fidelity gamification. It is powered by a robust backend ("Ghost Operating System") that allows for real-time control of 23 global markets, AI content generation, and live user operations.

This document serves as the definitive catalog of every feature, screen, and capability within the ecosystem.

---

# 📱 PART 1: The Mobile Application (User Front-End)

## I. Entry & Security
**1. Authentication Suite (`Auth.jsx`)**
*   **Dual-Path Access:**
    *   **Guest Mode:** Allows immediate, frictionless entry ("Try before you buy"). Progress is saved locally and seamlessly transferred upon signup.
    *   **Secure Signup:** Email/Password, Google, and Apple ID integration.
*   **Visuals:** Dynamic background animations (Particle Mesh) with "Glassmorphism" UI cards.

**2. Smart Onboarding (`Onboarding.jsx`)**
*   **Interactive Carousel:** A 3-step value proposition tour (Learn, Play, Win).
*   **Persona Selection:** Users identify as "Beginner," "Intermediate," or "Pro" to customize their initial feed algorithm.

---

## II. The Investor Terminal (Professional Mode)
*Designed for execution, analysis, and wealth management.*

**1. Investor Dashboard (`InvestorHome.jsx`)**
*   **Global Market Carousel:** Swipeable header tracking major indices (S&P 500, TASI, EGX30, etc.) with real-time sparklines.
*   **Portfolio Snapshot:** "At-a-glance" view of Total Equity, Day's P/L, and Purchasing Power. Includes a **Privacy Toggle** for public usage.
*   **Economic Calendar Widget:** Countdown to high-impact events (Fed Rates, Non-Farm Payrolls).
*   **AI Daily Brief:** An automated, generated summary of market conditions specific to the user's region.

**2. Institutional Screener (`InvestorScreener.jsx`)**
*   **The Filtering Engine:** A desktop-class query builder optimized for touch.
*   **Fundamental Filters:**
    *   **Valuation:** P/E (Trailing/Forward), PEG, P/B, P/S, EV/EBITDA.
    *   **Profitability:** ROE, ROA, Gross/Operating/Net Margins.
    *   **Growth:** Revenue Growth (YoY), EPS Growth, 5Y Trend.
    *   **Dividends:** Yield %, Payout Ratio, Ex-Div Date.
*   **Technical Filters:**
    *   **Oscillators:** RSI (<30/>70), MACD, Stochastic.
    *   **Trend:** SMA 50/200 Crossovers ("Golden Cross"), Bollinger Band Width.
    *   **Risk:** Beta, Short Ratio, Debt/Equity.
*   **Visualization:** Interactive **Sector Heatmaps** (2D color grid) for instant market breadth analysis.

**3. Advanced Analysis Center (`InvestorAnalysis.jsx`)**
*   **Technical Radar:** A background scanning service that alerts users to active chart patterns (e.g., "Bullish Engulfing on $AAPL").
*   **Deep Charting:** Interactive charts supporting Candlestick, Line, Area, and Heikin Ashi modes with 1D/1W/1M/1Y/5Y timeframes.
*   **Peer Comparison:** "versus" mode to overlay competitor performance (e.g., Aramco vs. Chevron).

**4. Company Intelligence 360 (`CompanyProfile.jsx`)**
*   **The "Single Source of Truth":**
    *   **Live Heading:** Real-time Price, Change %, and Volume.
    *   **Financial Health:** Visual gauges for Liquidity (Current vs. Quick Ratio) and Solvency (Debt/Equity).
    *   **Ownership Structure:** Donut chart breakdown of Insider vs. Public vs. Institutional float.
    *   **Analyst Consensus:** Aggregated "Strong Buy" to "Strong Sell" meter with price target ranges (Low/Mean/High).
    *   **Sustainability:** ESG Scores (Environmental, Social, Governance) for ethics-focused investors.

---

## III. The Player Experience (Gamification Mode)
*Designed for acquisition, retention, and education.*

**1. Player Command Center (`PlayerHome.jsx`)**
*   **Gamified HUD:** Always-visible display of Level, XP Bar, Coin Balance, and "Streak" flame.
*   **Daily Missions:** 3 auto-generated tasks per day (e.g., "Read 2 Articles," "Win 1 Prediction") to drive daily active usage (DAU).
*   **Featured Contests:** Rotating banner of active competitions (e.g., "Crypto Week," "Saudi National Day Cup").

**2. "Pick & Predict" Engine (`Pick.jsx`)**
*   **The Core Loop:** Users wager virtual currency on short-term price movements (Higher/Lower over 1h/24h).
*   **Zero-Risk Thrill:** Simulates the dopamine hit of options trading without real financial risk.
*   **Haptic Rewards:** Massive visual and tactile feedback for winning streaks.

**3. The Academy (`Academy.jsx` & `LessonDetail.jsx`)**
*   **Learn-to-Earn:** Users are paid in XP/Coins for completing modules.
*   **Curriculum:** Structured paths from "Stock Basics" to "Technical Analysis Mastery."
*   **Quiz Engine:** Interactive multiple-choice tests at the end of each lesson to verify knowledge.

**4. Social Competition (`Leaderboard.jsx` & `Clans.jsx`)**
*   **Global Rankings:** Real-time leaderboards sorted by ROI %, Streak, or Total Wealth.
*   **Clan Warfare:** Users can create/join "Clans" (Guilds) to compete in weekly aggregate tournaments.

---

## IV. Social & Intelligence Layer

**1. Smart News Feed (`NewsFeed.jsx`)**
*   **Sentiment Analysis:** Articles are border-coded Green (Bullish) or Red (Bearish) by our NLP engine.
*   **Source Diversity:** Aggregates from Reuters, Bloomberg, and authorized local publishers (Maaal, Argaam).
*   **Context Aware:** Feed automatically filters news based on the user's watchlist and portfolio.

**2. Community Hub (`XCommunity.jsx`)**
*   **Discussion Boards:** Threaded conversations tagged by Ticker ($Symbol).
*   **Influencer System:** Verified badges for high-performing traders or certified analysts.
*   **Social Graph:** Follow/Unfollow mechanics to curate a personalized feed of expert opinions.

---

# 💻 PART 2: The "Ghost" Operating System (Backend Admin)

## I. Strategic Command
**1. Master Dashboard (`AdminDashboard.jsx`)**
*   **Health Monitor:** Live server metrics (API Latency, Database Load, Error Rates).
*   **Business KPIs:** Real-time tracking of DAU (Daily Active Users), CAC (Cost of Acquisition), and Retention Rates.
*   **Live Map:** Geolocated visualization of current active users around the globe.

**2. AI Control Tower (`AdminAIDashboard.jsx`)**
*   **"Turbo Graph" Monitor:** Controls the generative AI pipeline.
*   **Sentiment Tuning:** Admins can manually override or fine-tune sentiment scoring weights.
*   **Generation Logistics:** Track tokens used, generation costs, and speed metrics for the `neural-gen` service.

## II. Global Market Operations
**1. Market Configurator (`AdminGlobalMarkets.jsx`)**
*   **Multi-Market Control:** Enable/Disable entire exchanges (e.g., "Close TASI for holiday") with one switch.
*   **Currency & Time:** Manage exchange rates and trading hour schedules for all 23 supported markets.

**2. Market Profiler (`AdminMarketProfile.jsx`)**
*   **Index Management:** Manually adjust index compositions or weighting logic.
*   **Data Override:** Emergency override tools to correct erroneous price or fundamental data manually.

## III. Live Operations (LiveOps)
**1. Contest Manager (`AdminContests.jsx`)**
*   **Instant Deployment:** Create and launch a branded tournament in <60 seconds.
*   **Rules Engine:** Configure entry fees, prize pools, duration, and allowed asset classes.

**2. Challenge & Quest Engine (`AdminChallenges.jsx`)**
*   **Scenario Builder:** Create specific scenarios (e.g., "Survive the Crash") for educational impact.
*   **Reward Logic:** Set dynamic XP/Coin rewards for specific user behaviors.

**3. Virtual Economy (`AdminShop.jsx`)**
*   **Inventory Management:** Control items in the user shop (Avatars, Profile Frames, Boosters).
*   **Economy Balancing:** Tools to monitor inflation (Coin Supply) and adjust sinks/faucets.

## IV. Content Studio
**1. The Newsroom (`AdminNews.jsx` & `NewsEditor.jsx`)**
*   **CMS Power:** Full rich-text editor for publishing original content or manual curation.
*   **Push Notification Integration:** "Publish & Push" capability to send breaking news alerts to all users instantly.

**2. Academy Builder (`AdminLessons.jsx`)**
*   **Curriculum Designer:** Drag-and-drop interface to reorder lessons and modules.
*   **Quiz Creator:** Built-in tool to write questions and define correct answers for lesson quizzes.

**3. User CRM (`AdminUsers.jsx`)**
*   **Investigator Tool:** View full user history, trades, and social logs for support tickets.
*   **Ban Hammer:** Tools to suspend or restrict abusive accounts.
*   **VIP Management:** Manually grant "Pro" status or gift currency to influencers/partners.

---

# 🏆 Conclusion
Stock Hero represents a complete paradigm shift in retail fintech.

By fusing a **Bloomberg-level analytic terminal** with a **Zynga-level engagement engine**, and powering it all with an **Enterprise-grade "Ghost" backend**, we have created a platform that is not just a tool, but a daily habit for millions of investors.
