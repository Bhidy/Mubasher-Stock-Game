# 🇪🇬 Egypt Travel Intelligence Platform

A standalone, premium analytics dashboard for monitoring public Instagram posts from Egypt-based travel agencies and converting them into structured, actionable travel offer intelligence.

![Dashboard Preview](https://img.shields.io/badge/Status-Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Prisma](https://img.shields.io/badge/Prisma-5-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- **Real-time Instagram Monitoring** - Track 14+ Egypt travel agencies automatically
- **Offer Detection Engine** - Extract prices, destinations, durations from Arabic/English posts
- **Premium Dashboard** - Executive summaries, filterable tables, trend charts
- **Account Management** - Add/remove agencies without code changes
- **Production Ready** - Built for analytics-grade reliability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended - free tier)
- Apify account ([apify.com](https://apify.com) - free tier available)

### 1. Clone & Install

```bash
cd egypt-travel-intel
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/egypt_travel_intel?sslmode=require"
APIFY_API_TOKEN="apify_api_xxxxx"
```

### 3. Initialize Database

```bash
npx prisma db push    # Create tables
npm run db:seed       # Seed 14 initial agencies
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Dashboard Sections

| Section | Description |
|---------|-------------|
| **Executive Summary** | Active agencies, total posts, offers found, sync status |
| **Destination Trends** | Visual breakdown of where offers are going |
| **Pricing Insights** | Min/avg/max prices with trend indicators |
| **Agency Leaderboard** | Most active agencies ranked by posts |
| **Offers Table** | Filterable, sortable table with all detected offers |
| **Pipeline Health** | Recent ingestion run logs and error tracking |

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/offers` | GET | List offers with filters & pagination |
| `/api/accounts` | GET/POST/PATCH/DELETE | Manage tracked agencies |
| `/api/ingest` | POST/GET | Trigger ingestion / get status |
| `/api/stats` | GET | Dashboard analytics data |

## 📱 Managing Agencies

### Add New Agency

Navigate to `/accounts` or use the API:

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"handle": "newagency", "displayName": "New Agency"}'
```

### Toggle Active/Inactive

Inactive agencies are skipped during ingestion but their data is preserved.

### Remove Agency

Deleting removes the agency and all associated posts/offers.

## 🔄 Data Ingestion

### Manual Trigger

Click "Fetch New Data" in the dashboard, or:

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"postsPerAccount": 20}'
```

### Offer Detection

The detection engine analyzes post captions for:

- **Prices**: EGP, USD, EUR with Arabic/English patterns
- **Destinations**: 15+ Egypt locations including أسوان, شرم الشيخ
- **Duration**: 3N/4D, weekend, ليالي formats
- **Offer Type**: Hotel, package, cruise, day trip, etc.
- **Keywords**: عرض, خصم, discount, offer, شامل

## 🏗️ Tech Stack

- **Framework**: Next.js 16 App Router
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Scraping**: Apify Instagram Scraper

## 📁 Project Structure

```
egypt-travel-intel/
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Initial agencies
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main dashboard
│   │   ├── accounts/        # Account management
│   │   └── api/             # API routes
│   └── lib/
│       ├── db.ts            # Prisma client
│       ├── utils.ts         # Helpers
│       └── ingestion/       # Scraping & detection
└── .env.example
```

## 🚢 Deployment

### Cloudflare Pages (Recommended)

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variables in Cloudflare dashboard

### Vercel

```bash
npx vercel
```

## 📈 Extending the Platform

| Extension | How |
|-----------|-----|
| Add agencies | Use `/accounts` UI or API |
| Add destinations | Edit `src/lib/ingestion/detector.ts` |
| Add platforms | Create new scraper in `src/lib/ingestion/` |
| Add insights | Create new API route + dashboard component |

## 📄 License

Private - All rights reserved

---

Built with ❤️ for Egypt Travel Intelligence
