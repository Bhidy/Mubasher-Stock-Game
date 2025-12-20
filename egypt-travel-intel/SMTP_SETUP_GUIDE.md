# Professional Setup Guide: Automated Email Reporting

## Phase 1: Generate Security Credentials (Google)
You are currently on the **App Name** screen. Follow these exact steps:

1.  **Enter App Name**: Type `Egypt Travel Intel` in the "App name" box found in your browser.
2.  **Generate Password**: Click the **Create** button.
3.  **Copy Credentials**: Google will show a popup with a **16-character code** (e.g., `abcd efgh ijkl mnop`).
    *   *Action*: Copy this code immediately. You will not see it again.

## Phase 2: Configure System Environment
Now, apply these credentials to your application configuration.

1.  **Open Configuration File**:
    *   In your code editor, open the file named `.env`.

2.  **Input Credentials**:
    *   Locate the `SMTP_USER=` field. Enter your **Gmail address**.
    *   Locate the `SMTP_PASS=` field. Paste the **16-character code** you just copied from Google.
    *   Locate `REPORT_EMAIL_TO=`. Enter the email address that should **receive** the reports.

    *Example Configuration:*
    ```env
    SMTP_USER=ceo@anty-gravity.com
    SMTP_PASS=abcd efgh ijkl mnop  <-- Paste the Google code here
    REPORT_EMAIL_TO=ceo@anty-gravity.com
    ```

3.  **Save**: Press `Cmd + S` to save the file.

## Phase 3: Verification
Ensure the system is working correctly.

1.  **Trigger Test Run**:
    *   Click this link to force a system run: [http://localhost:3000/api/cron/ingest](http://localhost:3000/api/cron/ingest)

2.  **Confirm Receipt**:
    *   Wait approximately 30-60 seconds (for the scraping to complete).
    *   Check your inbox for an email with the subject: **"📈 Market Pulse: New Offers Detected"**.

**Status**: Once these steps are complete, the system is fully autonomous and will report every 6 hours.
