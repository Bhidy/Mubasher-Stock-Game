# Full Mobile App Functionality Plan

## Executive Summary
Make both Player Mode and Investor Mode fully functional with all buttons, screens, and features working like a real production app.

---

## Current State Analysis

### Player Mode (Gamified Experience)
| Screen | Status | Issues/Missing |
|--------|--------|----------------|
| PlayerHome | ✅ Exists | Buttons need linking |
| PlayerChallenges | ✅ Exists | Connected to CMS |
| PlayerAchievements | ✅ Exists | Using static data |
| PlayerShop | ✅ Exists | Connected to CMS |
| Pick (Stock Prediction) | ✅ Exists | Needs verification |
| Live (Contest) | ✅ Exists | Needs verification |
| Academy (Learn) | ✅ Exists | Needs CMS connection |
| Daily Spin | ✅ Exists | Needs verification |
| Leaderboard | ✅ Exists | Needs verification |
| Community | ✅ Exists | Needs verification |
| Clans | ✅ Exists | Needs verification |
| Profile | ❌ Missing | Need to create |
| Notifications | ❌ Missing | Need to create |

### Investor Mode (Professional Experience)
| Screen | Status | Issues/Missing |
|--------|--------|----------------|
| InvestorHome | ✅ Exists | Buttons need linking |
| InvestorPortfolio | ✅ Exists | Needs verification |
| InvestorWatchlist | ✅ Exists | Needs verification |
| InvestorScreener | ✅ Exists | Needs verification |
| InvestorCalendar | ✅ Exists | Needs verification |
| InvestorAlerts | ✅ Exists | Needs verification |
| InvestorNotes | ✅ Exists | Needs verification |
| Market Summary | ✅ Exists | Shared screen |
| Company Profile | ✅ Exists | Shared screen |
| News Feed | ✅ Exists | Shared screen |
| Profile | ❌ Missing | Need to create (shared) |
| Notifications | ❌ Missing | Need to create (shared) |

### Shared Components
| Component | Status | Issues |
|-----------|--------|--------|
| Bottom Navigation | ✅ Works | Mode-aware |
| Burger Menu | ✅ Works | All links need verification |
| Mode Switcher | ✅ Works | Floating button |
| Chatbot | ✅ Exists | Needs verification |

---

## Implementation Plan

### Phase 1: Missing Screens (Priority: High)
1. **Profile Screen** (Shared - both modes)
   - User info, stats, settings
   - Edit profile modal
   - Notification preferences
   - Logout functionality

2. **Notifications Screen** (Shared - both modes)
   - Price alerts
   - Challenge completions
   - Achievement unlocks
   - News mentions
   - System announcements

### Phase 2: Button & Link Verification (Priority: High)
For each screen, verify all interactive elements:

**PlayerHome:**
- [ ] XP Progress Bar - shows level up info
- [ ] Streak counter - links to rewards
- [ ] Quick action buttons (Pick, Challenges, Shop, etc.)
- [ ] Announcement banners - CMS connected
- [ ] Profile icon - links to profile
- [ ] Notifications bell - links to notifications

**InvestorHome:**
- [ ] Market indices cards - real data
- [ ] Quick action buttons (Portfolio, Watchlist, etc.)
- [ ] Market movers section
- [ ] News preview cards
- [ ] Profile icon - links to profile
- [ ] Notifications bell - links to notifications

### Phase 3: CMS Integration (Priority: Medium)
Connect remaining screens to CMS:
- [ ] Academy lessons from CMS
- [ ] Announcements banner on home screens
- [ ] News articles (CMS for custom articles)

### Phase 4: Data Flow & State (Priority: Medium)
Ensure consistent data across all screens:
- [ ] User coins/XP update everywhere
- [ ] Portfolio values sync
- [ ] Watchlist updates reflect
- [ ] Challenge progress tracks

### Phase 5: Polish & Edge Cases (Priority: Low)
- [ ] Loading states for all screens
- [ ] Error states for failed data
- [ ] Empty states for no content
- [ ] Pull-to-refresh where applicable

---

## New Screens to Create

### 1. Profile.jsx (Shared)
Location: `src/screens/shared/Profile.jsx`
Features:
- Display user avatar, name, email
- Player stats (Level, XP, Coins, Rank) OR Investor stats (Portfolio value, accuracy)
- Settings sections (Account, Preferences, Support)
- Edit profile modal
- Dark mode toggle
- Logout button

### 2. Notifications.jsx (Shared)
Location: `src/screens/shared/Notifications.jsx`
Features:
- Grouped notifications by type
- Read/unread status
- Clear all button
- Filter by type
- Empty state

### 3. PlayerProgress.jsx (Player Mode)
Location: `src/screens/player/PlayerProgress.jsx`
Features:
- Detailed level progress
- XP breakdown by activity
- Next rewards preview
- Streak history

---

## Route Updates Needed

Add to App.jsx:
```jsx
// Shared routes
<Route path="/profile" element={<Profile />} />
<Route path="/notifications" element={<Notifications />} />

// Player routes
<Route path="/player/progress" element={<PlayerProgress />} />
```

---

## Button Mapping Audit

### PlayerHome Buttons to Verify:
1. Profile avatar → /profile
2. Notification bell → /notifications
3. "Pick Stocks" button → /player/pick
4. "Challenges" card → /player/challenges
5. "Shop" card → /player/shop
6. "Leaderboard" → /leaderboard
7. "Daily Spin" → /spin
8. "Learn" → /player/learn

### InvestorHome Buttons to Verify:
1. Profile avatar → /profile
2. Notification bell → /notifications
3. "View All" stocks → /market
4. Each stock card → /company/:symbol
5. "Portfolio" → /investor/portfolio
6. "Watchlist" → /investor/watchlist
7. "Screener" → /investor/screener
8. News articles → /news/:id

### Burger Menu Items to Verify:
All menu items should have working navigation paths.

---

## Estimated Work

| Task | Time | Priority |
|------|------|----------|
| Profile Screen | 30 min | High |
| Notifications Screen | 30 min | High |
| Route updates | 10 min | High |
| PlayerHome button audit | 20 min | High |
| InvestorHome button audit | 20 min | High |
| CMS connections | 30 min | Medium |
| Testing & fixes | 30 min | Medium |

**Total: ~2.5 hours**

---

## Success Criteria

1. ✅ All buttons navigate to correct screens
2. ✅ No dead-end pages
3. ✅ Profile accessible from both modes
4. ✅ Notifications show relevant content
5. ✅ Data syncs across screens (coins, XP, etc.)
6. ✅ Empty states shown when no data
7. ✅ Loading states during data fetch
8. ✅ All CMS content displays correctly

---

## Deployment Plan

1. Complete all changes
2. Test locally on localhost:5173
3. Commit to staging-dual-mode branch
4. Deploy to staging-bhidy.vercel.app
5. Update alias to point to new deployment
6. Final verification on staging URL
