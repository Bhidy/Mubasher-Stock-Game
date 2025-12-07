# Mubasher Stock Game - Component Documentation

## ⚠️ CRITICAL RULES - DO NOT MODIFY WITHOUT USER REQUEST

This document outlines the core features and their specifications. 
**Any changes to these specifications require explicit user approval.**

---

## 1. StockCard Component (`src/components/StockCard.jsx`)

### Features & Specifications:

| Feature | Specification | Status |
|---------|---------------|--------|
| **Stock Tag Badge** | Top-left corner showing: Trending (🔥), Safe (🛡️), or Volatile (⚡) | ✅ Required |
| **View Button** | Top-right corner, **ONLY for Aramco (2222)** | ✅ Only Aramco |
| **Stock Logos** | Multi-fallback system: TradingView → Clearbit → Brand Initials | ✅ Required |
| **Selection Checkmark** | Shows when card is clicked/selected | ✅ Required |
| **Click Behavior** | Click card to select (no toggle switch) | ✅ Required |
| **Price Format** | Always show 2 decimals + "SAR" (e.g., "96.00 SAR") | ✅ Required |
| **User Count** | Show number of users picked, NOT percentage | ✅ Required |

### Stock Tags Mapping:
```javascript
const STOCK_TAGS = {
    '2222': 'safe',      // Aramco - stable blue chip
    '1120': 'safe',      // Al Rajhi Bank - stable banking
    '2010': 'trending',  // SABIC - trending materials
    '7010': 'safe',      // STC - stable telecom
    '2082': 'volatile',  // ACWA Power - high growth volatile
};
```
## 1. StockCard (`src/components/StockCard.jsx`)
- **Purpose**: Displays individual stock information in lists (Pick, Live, etc.).
- **Visual Style**:
  - **Rarity System**: Border colors based on rarity (Common: Gray, Rare: Blue, Epic: Purple, Legendary: Gold).
  - **Selection State**: Thick primary border + Checkmark badge when selected.
  - **Stock Logo**:
    - **Primary**: Real TradingView logo URLs.
    - **Fallback**: Brand-colored container with stock initials.
    - **No Network Requests**: Fallback is instant; images load asynchronously.
  - **Tags**: "Trending" (Flame), "Safe" (Shield), "Volatile" (Zap) badges.
  - **Price Display**: 2 decimal places + "SAR" (e.g., "95.85 SAR").
  - **User Count**: "X users picked" (e.g., "4,291 users picked").
- **Data**:
  - **20 Saudi Stocks**: Full dataset with Ticker, Name, Initials, Brand Color, Tag, User Count, and Logo URL.
  - **Aramco Special**: "View" button only on Aramco card.

## 2. Pick Page (`src/screens/Pick.jsx`)
- **Purpose**: User selects 3 stocks for their daily deck.
- **Features**:
  - **Stock List**: Displays all 20 available Saudi stocks.
  - **Filtering**: All, Trending, Safe, Volatile.
  - **Selection Logic**: Max 3 stocks.
  - **Deck Bar**: Fixed bottom bar showing selected stocks.
  - **Lock In**: "Lock In Deck" button (active only when 3 stocks selected).
  - **Scroll to Top**: Auto-scroll to top on mount.

## 3. Live Page (`src/screens/Live.jsx`)
- **Purpose**: Real-time tracking of the user's selected deck.
- **Features**:
  - **Live Indicator**: Blinking red dot "LIVE CONTEST".
  - **Performance Hero**:
    - Large percentage gain/loss display.
    - **Title**: "Your Performance" (no emoji icon).
    - **Tooltip**: Centered full-page modal explaining the calculation ((S1+S2+S3)/3).
    - **Color Coding**: Green for positive, Red for negative.
  - **Tabs**: "My Deck" and "Leaderboard".
  - **Stock List**: Shows the user's 3 picked stocks with real-time price updates.
  - **Leaderboard**: Top players list.

## 4. Home Page (`src/screens/Home.jsx`)
- **Purpose**: Main dashboard.
- **Features**:
  - **Carousel Slider**:
    - **Slides**: 1. Streak Info, 2. Daily Challenge, 3. Invite Friend.
    - **Timing**: Auto-slides every 5 seconds.
    - **Invite Slide**: Blue Cola theme (#0D85D8), Gift icon, "Invite" button.
  - **Today's Contest Card**: Live status, timer, players count, prize pool, user rank.
  - **Stats Grid**: Best Rank, Win Rate.
  - **Quick Actions**: Leaderboard, Clans.
  - **Daily Spin**: Modal popup if not seen today.

## 5. Market Summary (`src/screens/MarketSummary.jsx`)
- **Purpose**: Overview of the Saudi market.
- **Design**:
  - **Theme**: "Blue Cola" (#0D85D8) & Teal/White. No purple/black.
  - **Layout**: No top navigation bar. Burger menu integrated into TASI card header.
  - **TASI Card**: Prominent main index display with updated time, compact design.
  - **Tabs**: Overview, Global, Sectors, Movers.
  - **Global Indices**: Added section for major world indices (S&P 500, Oil, Gold, etc.).
  - **Overview Tab**: Mix of Global preview, Top Gainers preview, and Market Breadth.
  - **Visuals**: Gradient backgrounds, sparkle decorations, progress bars.
  - **Data**: 20 stocks integration, sector performance, market breadth.

## 6. Invite Page (`src/screens/Invite.jsx`)
- **Purpose**: Referral system.
- **Design**:
  - **Theme**: "Blue Cola" (#0D85D8).
  - **Visuals**: Shiny effects, sparkles, gradients.
  - **Components**: Reward card, progress bar, referral link copy, friends list.

## Common Requirements
- **Scroll to Top**: All pages must scroll to top (0,0) on mount (`useEffect`).
- **Price Format**: Always `XX.XX SAR` (2 decimals).
- **Stock Logos**: Use `StockLogo` component. Prioritize real images, fallback to brand initials.
- **Colors**:
  - **Primary**: Blue Cola (#0D85D8).
  - **Success**: Green (#10b981).
  - **Danger**: Red (#ef4444).
  - **Warning**: Amber (#f59e0b).

---

## 7. Backend Price Updates (`backend/jobs/updateStockPrices.js`)

### Tadawul Trading Hours:
- **Days**: Sunday through Thursday
- **Hours**: 10:00 AM - 3:00 PM Saudi Arabian time (GMT+3)
- **Weekend**: Friday & Saturday (closed)

---

## 6. The 5 Agreed Stocks

| Ticker | Name | Tag | Users Picked |
|--------|------|-----|--------------|
| 2222.SR | Saudi Aramco | Safe | 4,291 |
| 1120.SR | Al Rajhi Bank | Safe | 3,847 |
| 2010.SR | SABIC | Trending | 2,156 |
| 7010.SR | STC | Safe | 1,892 |
| 2082.SR | ACWA Power | Volatile | 1,534 |

---

*Last Updated: December 5, 2024*
