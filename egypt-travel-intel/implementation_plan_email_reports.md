# Automated Market Intelligence Email Reports - Implementation Plan

## Objective
Implement a robust, automated email reporting system that sends a "Goo" designed summary of market intelligence every 6 hours.

## Architecture

1.  **Email Service (`src/lib/email.ts`)**
    *   Based on `nodemailer`.
    *   Handles SMTP transport setup.
    *   Contains the HTML generation logic for the "Goo" styled email.

2.  **Email Template Design ("The Goo Pulse")**
    *   **Header**: Gradient branding ("Market Intelligence Pulse").
    *   **Summary Cards**: Grid showing "Posts Scraped", "Offers Detected", "Efficiency".
    *   **Top Opportunities**: Table of the highest-confidence offers detected in this run.
    *   **Publisher Spotlight**: Top active agencies in this run.
    *   **Footer**: System status and timestamp.

3.  **Integration Point (`src/lib/ingestion/ingest.ts`)**
    *   The `runIngestion` function will trigger the email report upon completion.
    *   It will pass the exact stats of *that specific run* to the email generator.

4.  **Scheduling (Every 6 Hours)**
    *   **Local**: Update `src/lib/scheduler.ts` to run every 6 hours (`0 */6 * * *`).
    *   **Production**: Create `vercel.json` with a cron configuration calling `/api/ingest`.

## Implementation Steps

1.  **Install Dependencies**: `nodemailer`.
2.  **Create Email Service**: Implement `src/lib/email.ts` with the "Goo" design.
3.  **Update Ingestion Pipeline**: Modify `src/lib/ingestion/ingest.ts` to send the report.
4.  **Update Scheduler**: Change interval to 6 hours.
5.  **Environment Setup**: Define required ENV variables (`SMTP_HOST`, `SMTP_USER`, etc.).

## "Goo" Email Design Mockup

```html
<!-- Header -->
<div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 30px; border-radius: 16px 16px 0 0;">
  <h1 style="color: white; font-family: sans-serif;">Market Pulse 📈</h1>
</div>

<!-- Stats Grid -->
<div style="display: flex; gap: 10px; margin-top: 20px;">
  <div style="background: #F8FAFC; padding: 15px; border-radius: 12px; flex: 1;">
    <span style="color: #64748B; font-size: 12px; font-weight: bold;">POSTS</span>
    <div style="font-size: 24px; font-weight: bold; color: #1E293B;">1,240</div>
  </div>
  <div style="background: #ECFDF5; padding: 15px; border-radius: 12px; flex: 1;">
    <span style="color: #059669; font-size: 12px; font-weight: bold;">OFFERS</span>
    <div style="font-size: 24px; font-weight: bold; color: #059669;">85</div>
  </div>
</div>
```

## Required Environment Variables
```env
SMTP_HOST=smtp.gmail.com (or other)
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
REPORT_EMAIL_TO=recipient@example.com
```

This plan ensures robust, beautiful, and fully automated reporting.
