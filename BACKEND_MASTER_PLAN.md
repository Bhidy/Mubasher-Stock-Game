# Master Plan: Enterprise Backend System Evolution

## 1. Executive Summary
**Objective:** Transform the current "Admin Panel" into a robust, data-driven **Command Center** capable of managing a global financial application.
**Current State:** Basic CRUD (Create, Read, Update, Delete) for News/Lessons. Simple Lists.
**Target State:** A "Bloomberg Terminal" style admin system with real-time analytics, user intelligence (CRM), advanced gamification engines, and global system controls.

---

## 2. Architecture & Data Model Enhancements
To support "Global Scale" features, the underlying data structure in `api/cms.js` will be expanded.

### New Data Schemas (JSON Store)
*   **`analytics_metrics`**: Store daily snapshots of active users, retention rates, and coin economy stats (Inflation/Deflation).
*   **`users_crm`**: (Mock-able for now) A dedicated view to manage Players/Investors, ban abusive users, or grant specialized "Premium" access manually.
*   **`audit_logs`**: Track *who* changed *what* in the admin panel for security and accountability.
*   **`system_config`**: Global feature flags (e.g., "Enable Maintenance Mode", "Disable Trading", "Emergency Broadcast").

---

## 3. The "Command Center" Dashboard (New Homepage)
The current dashboard is too simple. The new Dashboard 2.0 will be a visual powerhouse using `recharts` for data visualization.

### Key Visual Components:
1.  **Live Traffic Pulse (Line Chart):** Real-time (simulated) view of active users in "Investor" vs "Player" modes.
2.  **Economy Health (Area Chart):** Tracking `Coins Distributed` vs `Coins Spent` to monitor game economy inflation.
3.  **Content Velocity (Bar Chart):** Number of News Articles/Lessons published per day by the editorial team.
4.  **User Sentiment (Pie Chart):** Aggregated data from "Bullish/Bearish" user predictions.
5.  **Critical Alerts Ticker:** System health status (API Latency, Scraper Health).

---

## 4. "Content Studio" Suite (Upgrades)
We will replicate the success of the new **News Editor** across other verticals.

### A. Education Studio (LMS) - `/admin/lessons`
*   **Upgrade:** Replace simple inputs with the **Rich Text Editor**.
*   **New Feature:** "Curriculum Builder" – Drag-and-drop reordering of lessons into Modules/Chapters.
*   **Quizzes:** Add a "Quiz Builder" attached to each lesson (Question -> 4 Options -> Correct Answer).

### B. Gamification Engine - `/admin/challenges`
*   **Rule Builder:** Instead of static text, create logic-based rules (e.g., `IF user_predictions > 5 AND accuracy > 80% THEN reward = 500 coins`).
*   **Contest Manager:** Create limited-time tournaments with countdown timers and dynamic prize pools.

---

## 5. New Modules (To Be Built)

### A. User Intelligence (CRM) - `/admin/users`
*   **User Table:** Searchable list of all registered users (Avatar, Name, Level, Net Worth).
*   **Player Profile View:** Deep dive into a specific user's history (Win Rate, Portfolio Value, Risk Score).
*   **Actions:** "Ban User", "Reset Password", "Gift Coins", "Send Push Notification".

### B. Marketing OS - `/admin/marketing`
*   **Push Notification Composer:** Send alerts to all users or specific segments (e.g., "Users in Egypt").
*   **Announcement Editor:** Manage the pop-up banners seen in the app (already exists but needs visual upgrade).

### C. System Settings - `/admin/settings`
*   **Feature Flags:** Toggles to enable/disable features without code deploys.
*   **API Management:** Monitor API usage quotas (News API, Market Data).

---

## 6. Implementation Roadmap

### Phase 1: Visual Core & Analytics (Immediate)
*   [ ] Install `recharts` for data visualization.
*   [ ] Build **Dashboard 2.0** with 4 key charts (Traffic, Economy, Content, Sentiment).
*   [ ] Create `AdminLayout` with a professional sidebar and "Dark Mode" toggle for the admin panel itself.

### Phase 2: CRM & User Management
*   [ ] Build `UserManagement` page with table filtering and sorting.
*   [ ] Implement "User Detail View" modal.

### Phase 3: Advanced Content (LMS)
*   [ ] Port `NewsEditor` logic to `LessonEditor`.
*   [ ] Implement Drag-and-Drop ordering for lessons.

### Phase 4: System Stability
*   [ ] Implement `Settings` page with global config state.

---

## 7. Technology Stack
*   **Charts:** `recharts` (Standard, responsive, beautiful).
*   **Icons:** `lucide-react` (Already used, consistent).
*   **Editor:** `react-quill` (Already integrated).
*   **Data:** Extended `JSONBlob` schemas + Client-side aggregation involved in `useCMS`.
