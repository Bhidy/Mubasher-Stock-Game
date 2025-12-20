# 🔐 Native Social Login Setup Guide for Stock Hero iOS

## Overview
This guide explains how to complete the native Google and Facebook login setup for the Stock Hero iOS app.

## Current Status
✅ `@capacitor-firebase/authentication` plugin installed
✅ Auth.jsx updated with native OAuth handlers
✅ Firebase config exports updated
✅ Capacitor config updated with plugin settings
✅ Info.plist URL schemes added
⚠️ **GoogleService-Info.plist needs to be downloaded from Firebase Console**

---

## Step 1: Download GoogleService-Info.plist from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **antigravity-4e8d9**
3. Click the ⚙️ gear icon → **Project Settings**
4. Scroll down to **Your apps**
5. If you don't see an iOS app, click **Add app** → **iOS**
   - Enter Bundle ID: `com.mubasher.stockgame`
   - App nickname: `Stock Hero iOS`
   - Click **Register app**
6. Download the `GoogleService-Info.plist` file
7. Replace the file at: `ios/App/App/GoogleService-Info.plist`

---

## Step 2: Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Google**
3. Toggle **Enable**
4. Add your support email
5. Click **Save**

---

## Step 3: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (antigravity-4e8d9)
3. Go to **APIs & Services** → **Credentials**
4. Find or create an **iOS OAuth 2.0 Client ID**
   - Application type: iOS
   - Bundle ID: `com.mubasher.stockgame`
5. Copy the **Client ID** (format: `XXXXX.apps.googleusercontent.com`)

---

## Step 4: Update Info.plist with Real Client ID

Open `ios/App/App/Info.plist` and update the URL scheme:

```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>com.googleusercontent.apps.YOUR_REAL_CLIENT_ID_HERE</string>
</array>
```

Replace `YOUR_REAL_CLIENT_ID_HERE` with the actual client ID from Google Cloud Console (just the first part before `.apps.googleusercontent.com`).

---

## Step 5: (Optional) Facebook Login Setup

For Facebook login:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing
3. Add **Facebook Login** product
4. Configure iOS settings:
   - Bundle ID: `com.mubasher.stockgame`
5. Add to Info.plist:

```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>fbYOUR_FACEBOOK_APP_ID</string>
</array>
<key>FacebookAppID</key>
<string>YOUR_FACEBOOK_APP_ID</string>
<key>FacebookDisplayName</key>
<string>Stock Hero</string>
```

6. Add Facebook App ID to Firebase Console → Authentication → Sign-in method → Facebook

---

## Step 6: Build and Test

After completing the above steps:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Then archive and upload to TestFlight.

---

## Troubleshooting

### "No ID token received from Google"
- Ensure GoogleService-Info.plist is from Firebase Console
- Verify Bundle ID matches exactly
- Check that Google Sign-In is enabled in Firebase Console

### "User cancelled"
- This is normal if user presses cancel/back

### App crashes on Google button tap
- Verify GoogleService-Info.plist is properly added to Xcode project
- In Xcode: Right-click on App folder → Add Files → Select GoogleService-Info.plist

---

## Files Modified
- `src/screens/Auth.jsx` - Native OAuth handlers
- `src/config/firebase.js` - Added signInWithCredential export
- `capacitor.config.json` - Firebase plugin configuration
- `ios/App/App/Info.plist` - URL schemes
- `ios/App/App/GoogleService-Info.plist` - Firebase iOS config (NEEDS REPLACEMENT)
