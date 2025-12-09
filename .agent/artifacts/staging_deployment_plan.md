# Staging Deployment & Robust Backend Plan

## Overview
Deploy the dual-mode app (Player/Investor) and CMS Admin to staging with full API connectivity matching the live production app.

---

## Phase 1: Robust Backend System Enhancement
**Goal:** Transform in-memory CMS to a persistent, production-ready backend

### 1.1 Database Layer (Using Vercel KV/Edge Config)
- [ ] Set up Vercel KV (Redis) for CMS data persistence
- [ ] Create API routes for CMS CRUD operations:
  - `/api/cms/lessons` - Manage lessons
  - `/api/cms/challenges` - Manage challenges  
  - `/api/cms/achievements` - Manage achievements
  - `/api/cms/shop` - Manage shop items
  - `/api/cms/news` - Manage news articles
  - `/api/cms/announcements` - Manage announcements
  - `/api/cms/contests` - Manage contests

### 1.2 Admin Authentication
- [ ] Create admin login page
- [ ] Implement JWT-based authentication for admin routes
- [ ] Protect CMS routes with middleware

### 1.3 Real-time Sync
- [ ] Set up WebSocket or Server-Sent Events for real-time updates
- [ ] Connect CMSContext to backend API instead of in-memory storage

---

## Phase 2: Staging Environment Setup
**Goal:** Deploy to staging URL with same data sources as production

### 2.1 Vercel Staging Deployment
- [ ] Create staging branch: `git checkout -b staging-deploy`
- [ ] Configure Vercel for staging deployment
- [ ] Set up staging domain: `staging-bhidy.vercel.app` or similar
- [ ] Copy all environment variables from production

### 2.2 Environment Configuration
```env
# Staging Environment Variables (same as production)
VITE_API_BASE_URL=https://staging-bhidy.vercel.app
VITE_ENVIRONMENT=staging

# API Keys (same as production)
ALPHA_VANTAGE_API_KEY=xxx
FINNHUB_API_KEY=xxx
POLYGON_API_KEY=xxx
NEWS_API_KEY=xxx
```

---

## Phase 3: API Integration (Match Live App)
**Goal:** All data flows work identically to production

### 3.1 Market Data APIs
| Feature | API Source | Implementation |
|---------|-----------|----------------|
| Stock Prices | Polygon.io / Yahoo Finance | Existing `/api/stock` routes |
| Market Indices | Same sources | Existing `/api/indices` routes |
| Intraday Charts | Polygon / Alpha Vantage | Existing `/api/chart` routes |
| Historical Data | Same | Existing `/api/historicalData` routes |

### 3.2 Company Profile APIs
| Field | Source | Route |
|-------|--------|-------|
| Overview | FinnHub/Polygon | `/api/companyProfile` |
| Financials | Yahoo Finance | `/api/financials` |
| Key Metrics | Multiple sources | `/api/metrics` |
| Analyst Ratings | FinnHub | `/api/ratings` |
| News | Multiple scrapers | `/api/companyNews` |

### 3.3 News System
- [ ] Connect existing news scrapers:
  - Saudi: Aleqt, Maaal, Okaz (via Bing RSS)
  - Egypt: Mubasher, Daily News Egypt
  - US: Yahoo Finance, MarketWatch, Reuters
- [ ] Ensure full article content extraction
- [ ] Translation service for Arabic sources
- [ ] Caching layer for performance

### 3.4 Market-Specific Data
| Market | Index | Data Source |
|--------|-------|-------------|
| 🇸🇦 Saudi | TASI | Tadawul / Yahoo |
| 🇪🇬 Egypt | EGX30 | EGX / Yahoo |
| 🇺🇸 USA | S&P 500, NASDAQ | Yahoo / Polygon |

---

## Phase 4: CMS-to-Frontend Connection
**Goal:** CMS changes reflect immediately in mobile app

### 4.1 Player Mode Content
- [ ] Lessons from CMS → PlayerLearn screen
- [ ] Challenges from CMS → PlayerChallenges screen
- [ ] Achievements from CMS → PlayerAchievements screen
- [ ] Shop items from CMS → PlayerShop screen
- [ ] Announcements from CMS → In-app notifications

### 4.2 Investor Mode Content
- [ ] News articles from CMS → News feed
- [ ] Market announcements → Alert banners
- [ ] Economic calendar → Calendar screen

### 4.3 Shared Content
- [ ] Contests → Leaderboard
- [ ] App-wide announcements
- [ ] Feature toggles

---

## Phase 5: Deployment Steps

### 5.1 Pre-Deployment Checklist
- [ ] All routes working on localhost
- [ ] CMS admin accessible and functional
- [ ] Both Player/Investor modes tested
- [ ] Burger menu overlay fixed ✅
- [ ] All API endpoints returning data

### 5.2 Deployment Commands
```bash
# 1. Commit current changes
git add .
git commit -m "feat: Dual-mode app with CMS backend ready for staging"

# 2. Push to staging branch
git checkout -b staging-deploy
git push origin staging-deploy

# 3. Deploy to Vercel (staging)
vercel --prod --scope=your-team

# Or if using Vercel CLI for preview:
vercel
```

### 5.3 Post-Deployment Verification
- [ ] Staging URL accessible
- [ ] Admin CMS at `/admin` working
- [ ] Player mode at `/player/home` working
- [ ] Investor mode at `/investor/home` working
- [ ] All API data loading correctly
- [ ] News articles showing with full content
- [ ] Charts rendering properly
- [ ] Company profiles complete

---

## Phase 6: Quality Assurance

### 6.1 Data Verification Checklist
| Item | Status | Notes |
|------|--------|-------|
| Stock prices real-time | ⏳ | |
| Market indices updating | ⏳ | |
| Charts loading all timeframes | ⏳ | |
| Company profile - all tabs | ⏳ | |
| News - full articles | ⏳ | |
| SA Market data | ⏳ | |
| EG Market data | ⏳ | |
| US Market data | ⏳ | |

### 6.2 CMS Verification
| Feature | Status |
|---------|--------|
| Create/Edit/Delete Lessons | ⏳ |
| Create/Edit/Delete Challenges | ⏳ |
| Create/Edit/Delete Achievements | ⏳ |
| Create/Edit/Delete Shop Items | ⏳ |
| Create/Edit/Delete News | ⏳ |
| Create/Edit/Delete Announcements | ⏳ |
| Changes sync to mobile app | ⏳ |

---

## Execution Order

### Today (Immediate)
1. ✅ Complete CMS admin screens with CMSContext
2. ⬜ Create API routes for CMS CRUD operations
3. ⬜ Connect CMSContext to API routes
4. ⬜ Test all CMS operations

### Next Step
5. ⬜ Create staging branch and deploy
6. ⬜ Verify all APIs work on staging
7. ⬜ Run full QA on staging

### Follow-up
8. ⬜ Add admin authentication
9. ⬜ Set up real-time sync
10. ⬜ Performance optimization

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Staging Environment                       │
│                  staging-bhidy.vercel.app                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐      ┌─────────────────┐               │
│  │  Mobile App     │      │   CMS Admin     │               │
│  │  (Player/       │      │   (Desktop      │               │
│  │   Investor)     │      │    Web View)    │               │
│  └────────┬────────┘      └────────┬────────┘               │
│           │                        │                         │
│           └──────────┬─────────────┘                        │
│                      │                                       │
│           ┌──────────▼──────────┐                           │
│           │    CMSContext       │                           │
│           │  (State Management) │                           │
│           └──────────┬──────────┘                           │
│                      │                                       │
│           ┌──────────▼──────────┐                           │
│           │   API Routes        │                           │
│           │  /api/cms/*         │                           │
│           │  /api/stock         │                           │
│           │  /api/news          │                           │
│           │  /api/chart         │                           │
│           └──────────┬──────────┘                           │
│                      │                                       │
│    ┌─────────────────┼─────────────────┐                    │
│    │                 │                 │                     │
│    ▼                 ▼                 ▼                     │
│ ┌──────┐       ┌──────────┐      ┌──────────┐              │
│ │Vercel│       │ External │      │  News    │              │
│ │  KV  │       │   APIs   │      │ Scrapers │              │
│ │(CMS) │       │(Polygon, │      │(Bing RSS,│              │
│ │      │       │ Yahoo,   │      │ Direct)  │              │
│ │      │       │ FinnHub) │      │          │              │
│ └──────┘       └──────────┘      └──────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Notes

- **Same Data Sources**: Staging will use the exact same API keys and data sources as production
- **CMS Isolation**: Staging CMS data will be separate from production to allow testing
- **No Live User Impact**: Staging is completely isolated from live users
- **Easy Promotion**: Once staging is verified, can promote to production
