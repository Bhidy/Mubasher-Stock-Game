---
description: Deploy updated APK and web app
---

# Deploy Updates Workflow

This workflow builds and deploys both the Android APK and web app to production with automatic version tracking.

## Before Starting

⚠️ **IMPORTANT**: Do NOT run this workflow automatically. Only run when explicitly requested by the user.
The user may be making local changes and will ask for deployment when ready.

Check `.agent/version.json` for current version and update if needed:
- Minor update (new features): 1.0 → 1.1 → 1.2 ... → 2.0
- Major update (breaking changes): 1.9 → 2.0

## Steps

// turbo-all

1. Build production web bundle
```bash
npm run build
```

2. Sync web assets to Android
```bash
npx cap sync android
```

3. Build Android APK
```bash
cd android && ./gradlew assembleRelease && cd ..
```

4. Copy APK to Desktop with version number (UPDATE VERSION HERE)
```bash
cp android/app/build/outputs/apk/release/app-release-unsigned.apk ~/Desktop/Stocks-Hero-v1.3.apk
```

5. Deploy to Vercel
```bash
npx -y vercel --prod
```

6. After successful deployment, update `.agent/version.json`:
   - Increment `currentVersion`
   - Add entry to `versionHistory` with changes
   - Update `nextVersion`

## Output Files

- **APK**: `~/Desktop/Mubasher-Stock-Game-v[VERSION].apk`
- **Web**: https://bhidy.vercel.app ⚠️ **ALWAYS THIS URL - Never create new URLs**

## Important Notes

- **Production URL is fixed**: All deployments overwrite https://bhidy.vercel.app
- Vercel's `--prod` flag automatically deploys to the production domain
- Each deployment creates a new build but keeps the same URL

## Version History

See `.agent/version.json` for complete history.

## Estimated Time

~30-45 seconds total (all steps combined)

