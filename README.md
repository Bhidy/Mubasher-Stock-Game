# 🚀 Stock Hero (Antigravity)
**High-Performance Stock Simulation Platform**

![Status](https://img.shields.io/badge/Status-Active-success)
![Architecture](https://img.shields.io/badge/Architecture-Data%20Lake-blue)
![Deployment](https://img.shields.io/badge/Deploy-Cloudflare-orange)

## 📖 Overview
Stock Hero is a Gamified Stock Trading Platform that allows users to compete in leagues, unlock achievements, and track real-time global markets.

**Production URL**: [https://bhidy-app.pages.dev](https://bhidy-app.pages.dev)

---

## 🏗️ Architecture "The Forever Fix"
This project uses a specialized **Data Lake Architecture** to bypass API rate limits and ensure 100% uptime.

*   **Frontend**: React (Vite) hosted on Cloudflare Pages.
*   **Data**: Static JSON files served via GitHub Raw CDN ("The Data Lake").
*   **Backend**: Serverless Edge Functions (proxies) + Firebase (Auth/DB).

**👉 [Read the Full System Architecture](./brain/4644ad5c-a8b6-458f-a544-07c8e9d6a601/system_architecture.md)**

---

## ⚠️ Important Rules
**ALL CONTRIBUTORS & AI AGENTS MUST READ THIS:**
We enforce a strict **"Serverless Data Lake"** policy. The production app does NOT rely on our legacy Node.js backend for critical path operations.

**👉 [Read Project Rules](./PROJECT_RULES.md)**

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
# App opens at http://localhost:5173
```
*Note: Local dev uses the Cloudflare `functions/api` proxy logic which routes to the GitHub Data Lake.*

### 3. Deploy to Production
**Method: Manual (Reliable)**
We currently use manual deployment to bypass CI/CD timeouts.
```bash
# 1. Build the app
npm run build

# 2. Deploy via Wrangler
npx wrangler pages deploy dist --project-name bhidy-app
```

---

## 📂 Project Structure
*   `functions/api/`: Cloudflare Edge Functions (The "Backend" for Data).
*   `src/`: React Frontend Code.
*   `public/data/`: **The Data Lake**. Contains `stocks.json` and `profiles/`.
*   `backend/`: Python scripts that power the "Data Pump" (GitHub Actions).
*   `.github/workflows/`: Scheduler for data ingestion.

---

## 🛠️ Operational Tasks

### How to add a new Stock/Market?
1.  Edit `backend/ingest_master.py` to include the ticker.
2.  Commit and Push.
3.  Go to GitHub Actions -> Run "Data Pump".
4.  Wait ~10 mins for the new static JSON to be generated.
5.  The frontend will automatically pick it up.

### How to fix "0.00" Data?
Check `public/data/profiles/{ticket}.json` in the Data Lake. If `price` or `change` is missing there, the issue is in the Ingestion Script (`ingest_master.py`), NOT the frontend.
