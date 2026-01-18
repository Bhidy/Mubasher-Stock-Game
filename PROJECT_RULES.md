# 🛡️ Project Rules & Architectural Standards

**CRITICAL: ALL AI AGENTS AND DEVELOPERS MUST READ THIS BEFORE MAKING CHANGES.**

This project follows a strict **"Serverless"** and **"Data Lake"** architecture to ensure 100% data reliability and zero-cost scaling. Deviating from these core principles will break the application.

## 🚫 Strictly Prohibited Actions
1.  **NO Direct API Calls**: Never implement logic that calls Yahoo Finance, Bloomberg, or any third-party market data API directly from the frontend (`src/`) or backend (`functions/`).
2.  **NO Node.js Backend Dependencies**: The Node.js backend (`stock-hero-backend`) is for reference/local dev only. The production app MUST function 100% via Cloudflare Pages + GitHub Data Lake.
3.  **NO Dynamic Scrapers**: Do not write code that scrapes websites on-demand. All scraping must happen in the `backend/` ingestion engine via GitHub Actions.
4.  **NO Vercel Deployments**: The production target is **Cloudflare Pages**. Do not attempt to deploy the frontend to Vercel.

## 🏗️ Core Architecture (The "Success Process")
### 1. Data Ingestion (The "Pump")
*   **Engine**: `backend/ingest_master.py`
*   **Trigger**: GitHub Actions (`.github/workflows/data-pump.yml`)
*   **Output**: Static JSON files committed to `public/data/` (stocks.json, profiles/, charts/)
*   **Rule**: To add a new stock/market, you **must** update `backend/ingest_master.py` and let the pump run. **Do not** try to fetch it dynamically.

### 2. Frontend Data Fetching
*   **Source**: Frontend must ONLY request data from the local proxy `/api/proxies` which maps to the Data Lake.
*   **Pattern**: `fetch('/api/stock-profile?symbol=...')` -> `functions/api/stock-profile.js` -> `raw.githubusercontent.com/.../profiles/...`
*   **Rule**: Always treat data as **Read-Only** and **Static**.

### 3. Authentication & User State
*   **Auth**: Direct Firebase Auth (Client SDK).
*   **Database**: Direct Firestore access (Client SDK).
*   **Rule**: No middleman server for Auth. `UserContext.jsx` manages all user state.

## 🚀 Deployment Standards
*   **Frontend**: Manual Deployment via `wrangler` is the current reliable method.
    ```bash
    npm run build
    npx wrangler pages deploy dist --project-name bhidy-app
    ```
*   **Backend (Data Pump)**: 
    *   **Rule**: **Always deploy fixes to `backend/` scripts immediately.**
    *   **Method**: Commit changes and manually trigger the GitHub Action if urgency is high.
    ```bash
    git commit -am "Fix: Update ingestion logic"
    git push
    # Action: Go to GitHub -> Actions -> 'Data Pump' -> 'Run workflow'
    ```

## 🛠️ Data Governance
*   **Global Indices**: Must use specific tickers (`^TASI.SR`, `^CASE30`) in ingestion but stripped (`TASI.SR`) for file storage to avoid filesystem issues.
*   **Images**: Stock logos are static assets in `public/logos/`.

---
**Adherence to these rules is mandatory to maintain the "Forever Fix" status of the project.**

## 🧠 AI Guidelines & Skills
*   **Skill Library**: This project works with **Antigravity Awesome Skills**.
*   **Rule**: Before starting any task (Coding, Planning, Debugging), check `.agent/skills/` for relevant skills.
    *   **Frontend**: Use `frontend-dev-guidelines` & `react-ui-patterns`.
    *   **Backend**: Use `backend-dev-guidelines`.
    *   **Planning**: Use `concise-planning` or `planning-with-files`.
*   **Location**: All skills are installed in `/Users/home/Documents/Antigravity/.agent/skills`.
