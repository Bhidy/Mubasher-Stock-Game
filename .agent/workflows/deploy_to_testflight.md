---
description: How to build and deploy Stock Hero to iOS TestFlight
---

# 🚀 Deployment Guide: Stock Hero to TestFlight (iOS)

This guide walks you through taking the web application code and uploading it to Apple TestFlight for internal testing.

## Prerequisites
*   **Xcode** installed (v15+ recommended).
*   **Apple Developer Account** (Active subscription required).
*   **Signing Certificate** & **Provisioning Profile** ready (Xcode handles this mostly automatically).

---

## Step 1: Sync Latest Code
Before opening Xcode, ensure the web assets are built and copied to the iOS project.
Run these commands in your terminal (or let the AI Agent do it):

```bash
# 1. Build the React App
npm run build

# 2. Sync to iOS folder
npx cap sync ios
```

---

## Step 2: Open Project in Xcode
1.  Navigate to the `ios/` folder in your project.
2.  Open the **Project** file: `ios/App/App.xcodeproj`.
    *   (Since this project uses SPM, we use the project file, not a workspace).

---

## Step 3: Configure Signing & Capabilities
1.  In the left sidebar (Project Navigator), click the very top **App** node (blue icon).
2.  Select the **App** target in the main view.
3.  Click the **"Signing & Capabilities"** tab.
4.  **Team:** Select your Apple Developer Team from the dropdown.
    *   If it says "None," click "Add Account" and log in with your Apple ID.
5.  **Bundle Identifier:** Ensure this is set to `com.mubasher.stockgame` (or your registered ID).
6.  **Signing Certificate:** Ensure "Automatically manage signing" is CHECKED. Xcode should create the provisioning profile for you.

---

## Step 4: Configure App Icons & Splash Screen (Optional)
Capacitor generates default icons. To update them:
1.  Open `App/Assets.xcassets`.
2.  Drag and drop your new icon files into the **AppIcon** slots.
3.  (Ideally, use the `capacitor-assets` tool to generate these automatically in the future).

---

## Step 5: Archive the Build
This creates the actual binary file for Apple.

1.  **Select Device:** In the top toolbar, verify the build target is set to **"Any iOS Device (arm64)"**. Do NOT select a specific simulator or connected phone.
2.  **Menu Bar:** Go to **Product** -> **Archive**.
3.  **Wait:** Xcode will compile the app. This may take 2-10 minutes.

---

## Step 6: Validate & Distribute
Once the specific "Organizer" window pops up showing your new Archive:

1.  Click the blue **"Distribute App"** button on the right.
2.  Select **"TestFlight & App Store"**.
3.  Click **Next/Distribute**.
    *   Xcode will now check for errors and upload the binary to Apple's servers.
4.  **Success:** You should see a green checkmark saying "App successfully uploaded."

---

## Step 7: Enable TestFlight
1.  Go to [App Store Connect](https://appstoreconnect.apple.com).
2.  Click **My Apps** -> **Stocks Hero**.
3.  Click the **TestFlight** tab.
4.  You should see your new build processing (yellow status).
5.  Once processed, click **Active** and add your email to the "Internal Testing" group.
6.  You will receive an email invite to install via the TestFlight app on your iPhone.

**Done! 🚀**
