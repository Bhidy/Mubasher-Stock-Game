
# Implementation Plan: Data Automation & Archiving Strategy

## 1. Automated Agency Onboarding (Immediate)
We will add the user-provided list of Instagram agencies to the `Account` database immediately.
- **Action**: Run a seeding script to inject handles like `venecia_travel`, `voytra`, etc.
- **Status**: Will be executed in this session.

## 2. Automated Post Updates (Ingestion Schedule)
To ensure the system updates automatically without manual clicks:
- **Mechanism**: Use **Vercel Cron Jobs** (recommended for Next.js) or a simple `setInterval` mechanism if running on a custom server.
- **Schedule**: Run the `/api/ingest` endpoint every **6 hours**.
    - This balances freshness with Instagram rate limits.
    - Timing: 6:00 AM, 12:00 PM, 6:00 PM, 12:00 AM.
- **Flow**:
    1.  Cron triggers `/api/ingest`.
    2.  Ingestion engine cycles through active accounts.
    3.  Fetches latest 10-20 posts.
    4.  Runs deduplication (skips if `postId` exists).
    5.  Runs AI Offer Detection.
    6.  Saves new Offers.

## 3. Archiving Strategy for Old Posts
We want to keep a rich history ("increase database information") without bloating the active query performance.
- **Current Architecture**: The `RawPost` table already acts as an archive.
- **Strategy**:
    - **Active Offers**: The `Offer` table contains high-value, detected deals.
    - **Archive Layer**: `RawPost` stores *everything*. We do NOT delete from `RawPost` unless explicitly requested.
    - **Retention**: Keep `RawPost` data indefinitely (text is small).
    - **Performance**: Add database indexes on `scrapedAt` and `accountHandle` (already done in Prisma schema).
    - **UI Archive View**: Create a "Reports" or "Archive" mode to view historical pricing trends over months/years.
- **Action**: No deletion policy is currently enforced, so archiving happens automatically.

## 4. Table Column Verification
We will verify and update the Dashboard table to include:
- **POST PUBLISHED DATE**: Mapped to `createdAt` or `postDate`.
- **HOTEL NAME**: Mapped to `hotelDetected`.
- **CITY/COUNTRY**: Mapped to `destinationDetected`.
- **OFFER DURATION**: Mapped to `durationDetected`.
- **PRICE**: Mapped to `priceDetected` + `currencyDetected`.
- **FLIGHT INCLUDED**: Mapped to `flightIncluded` (New Column).

## 5. Execution Steps
1.  **Add Agencies**: Inject the new list.
2.  **Update Table UI**: Modify `Dashboard` component to show the exact columns requested.
3.  **Verify Automation**: Confirm `/api/ingest` works cleanly.
