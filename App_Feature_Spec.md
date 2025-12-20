# Stock Hero: Mobile Application Feature Specification
**Version:** 2.1 (Forensic Detail)
**Date:** December 18, 2025
**Scope:** Frontend Mobile Application (iOS/Android PWA)

---

## 1. Global Application Architecture

### 1.1 Navigation & Layout
*   **Dual-Mode Navigation Bar:**
    *   **Player Mode:** 5-tab system (Home, Pick, Live, Social, Shop).
    *   **Investor Mode:** 5-tab system (Home, Markets, Portfolio, News, Watchlist).
    *   **Micro-Interaction:** Active tab scales up (1.1x) with gradient icon fill; inactive tabs are grayscale.
*   **Burger Menu (Sidebar):**
    *   **Trigger:** Top-left hamburger icon (animated open/close state).
    *   **Content:** Profile summary, Mode Switcher (Toggle), Settings, Help/Support.
    *   **Gesture:** Swipe from left bezel to open (iOS style).
*   **Mode Switcher:**
    *   **Mechanism:** Single tap toggle in Sidebar or Profile.
    *   **Effect:** Full app theme transition (Purple/Pink for Player -> Clean White/Blue for Investor).

### 1.2 Design System & Aesthetics
*   **Typography:** Google Fonts 'Outfit' (Sans-serif) for modern, clean readability.
*   **Player Theme:** "Gamified Neon" - Gradients of Violet (#8B5CF6), Pink (#EC4899), and Emerald (#10B981).
*   **Investor Theme:** "Terminal Pro" - Minimalist White (#FFFFFF), Slate (#1E293B), and Sky Blue (#0EA5E9).
*   **Motion:** `framer-motion` page transitions; `react-spring` for swipe gestures.

---

## 2. Authentication & Onboarding Flow

### 2.1 Splash Screen
*   **Visual:** Center logo with pulsating glow animation.
*   **Behavior:** Checks for cached auth token. If valid -> Redirect to Home. If invalid -> Redirect to Auth.

### 2.2 Login / Sign Up (`Auth.jsx`)
*   **Background:** Dynamic floating orbs (animated CSS gradients).
*   **Guest Access:** "Try as Guest" button (skips auth, local storage session).
*   **Social Auth:** Google & Facebook OAuth integration (Firebase Auth).
*   **Email Auth:** Collapsible form with validation (Email format, Password > 6 chars).
*   **Forgot Password:** Modal dialog with email input -> Firebase password reset trigger.

### 2.3 Interactive Onboarding (`Onboarding.jsx`)
*   **Carousel:** 3-slide value prop deck (Predict, Compete, Earn).
*   **Animation:** Background particles float based on slide index.
*   **Progress:** Dot indicators with active state transition.
*   **Action:** "Start Playing" button launches confetti effect and redirects to Player Home.

---

## 3. Player Mode: Feature Breakdown

### 3.1 Player Dashboard (`PlayerHome.jsx`)
*   **Status Header:**
    *   **Greeting:** Time-aware (Morning/Afternoon/Evening) + User Name.
    *   **Rank Badge:** e.g., "Rank #142 • Saudi Market".
*   **XP Progress Bar:**
    *   **Visual:** Linear gradient bar showing current XP / XP required for next level.
    *   **Overlay:** "Lvl 7" badge floats on the bar edge.
*   **Daily Challenges Widget:**
    *   **List:** 3 dynamic tasks (e.g., "Win 2 Picks").
    *   **Progress:** Calculation of `current / target` with visual progress bar.
    *   **Reward State:** Button changes to "Claimed" (Green) when complete.
*   **Quick Actions Grid:** 4-button grid (Pick, Live, Academy, Clans) with colored emoji icons.

### 3.2 Pick & Predict (`Pick.jsx`)
*   **Ticker Selector:** Horizontal scroll of available stocks (ARAMCO, APPLE, TESLA).
*   **Prediction Interface:**
    *   **Chart:** 1-hour sparkline showing recent trend.
    *   **Action:** HUGE "Up" (Green) and "Down" (Red) buttons.
    *   **Timer:** Countdown to prediction lock (e.g., "00:45s left").
*   **Betting Slider:**
    *   **Input:** Range slider to wager Coins (Min: 10, Max: 1000).
    *   **Logic:** Potential payout calculated dynamically (e.g., 1.8x payout).

### 3.3 Live Contests (`Live.jsx`)
*   **Event Lobby:** List of active contests (e.g., "Crypto Crash", "Earnings Week").
*   **Leaderboard:**
    *   **Real-time:** Updates every 30s.
    *   **Rows:** User Avatar | Name | Score | Trend Indicator.
    *   **Highlight:** Current user's row highlighted in gold.

### 3.4 Academy (`Academy.jsx`)
*   **Lesson Tracks:** Beginner, Intermediate, Advanced tabs.
*   **Lesson Card:**
    *   **Thumbnail:** 3D Icon (Book, Chart, Coin).
    *   **Meta:** Duration (5 min) + XP Reward (+50 XP).
    *   **Status:** Locked (Padlock icon) vs. Unlocked (Play icon).
*   **Quiz Module:**
    *   **Format:** Multiple choice question.
    *   **Feedback:** Instant Green/Red flash on selection.
    *   **Completion:** "Level Up" modal if XP threshold crossed.

---

## 4. Investor Mode: Feature Breakdown

### 4.1 Investor Dashboard (`InvestorHome.jsx`)
*   **Premium Header:**
    *   **Portfolio Value:** Large font display with hidden mode (eye toggle).
    *   **Daily P&L:** Percentage and absolute change (Green/Red color coding).
*   **Global Indices Carousel:**
    *   **Data:** Live feed for TASI, EGX30, S&P 500, NASDAQ.
    *   **Visual:** Mini-chart (sparkline) for each indexcard.
    *   **Interaction:** Tap index to switch app context to that market.
*   **Economic Calendar Widget:**
    *   **List:** Next 3 events (e.g., "Fed Rate Decision").
    *   **Impact Tags:** High/Medium/Low priority badges.

### 4.2 Portfolio Management (`InvestorPortfolio.jsx`)
*   **Asset Allocation Pie Chart:**
    *   **Visual:** D3.js interactive chart (Stocks, Crypto, Cash).
    *   **Legend:** Color-coded list with percentages.
*   **Holdings Table:**
    *   **Columns:** Ticker | Avg Price | Current Price | Returns (%).
    *   **Interaction:** Tap row to view detailed company profile.

### 4.3 Stock Analysis & Screener (`InvestorScreener.jsx`)
*   **Filter Engine:**
    *   **Parameters:** P/E Ratio, Market Cap, Sector, Dividend Yield.
    *   **UI:** Range sliders and pill selectors.
*   **Results List:** Infinite scroll list of matching stocks.

### 4.4 AI Investment Reports (`AIReportPage.jsx`)
*   **Generation:** "Generate Report" button triggers LLM (Large Language Model).
*   **Output Structure:**
    *   **Bull Case:** 3 key reasons to buy.
    *   **Bear Case:** 3 key risks.
    *   **Verdict:** Buy/Hold/Sell rating.
*   **Feature:** Text-to-Speech (Audio playback of the report).

---

## 5. Social & Community Ecosystem

### 5.1 News Feed (`NewsFeed.jsx`)
*   **Aggregation:** API calls to Bloomberg, Reuters, regional news.
*   **Smart Tags:** AI-generated tags (e.g., #Technology, #Oil, #Merger).
*   **Sentiment Analysis:** Color-coded border (Green=Positive, Red=Negative).

### 5.2 Clans (`Clans.jsx`)
*   **Clan Profile:** Shield/Badge editor, Member list, Chat room.
*   **Clan War:** Weekly leaderboard comparing aggregate clan returns.

### 5.3 User Profile (`Profile.jsx`)
*   **Stats Card:** Win Rate, Total Trades, Best Trade.
*   **Badges:** Grid of unlocked achievements (e.g., "Early Bird", "Whale").
*   **History:** Scrollable list of past predictions/trades.

---

## 6. Admin & CMS Capabilities
*Hidden from standard users, accessible to 'Admin' role.*

*   **News Publishing:** WYSIWYG editor to create news articles.
*   **Push Notifications:** Send global alerts to all devices.
*   **User Management:** Ban/Suspend users, Gift Coins/XP.

---

**Prepared for:** Deep Technical Due Diligence
**Status:** All features listed are implemented in Production (v2.1).
