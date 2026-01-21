# How to Build Android APK

## Current Status

Your app is currently a **web application**. To create an **APK file**, you need to wrap it as a native Android app using Capacitor.

## Prerequisites

Before building the APK, you need:

1. **Java JDK 11 or higher** 
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
   - Verify: `java -version`

2. **Android Studio**
   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - Install Android SDK (API level 33+)

3. **Node.js** (already installed)

## Quick Steps to Build APK

### Step 1: Install Dependencies

```bash
npm install
```

This will install Capacitor packages I've added to your project.

### Step 2: Build Your React App

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Step 3: Initialize Capacitor (First Time Only)

```bash
npx cap init
```

When prompted:
- **App name**: `Business Online`
- **App ID**: `com.businessonline.app` (or change to your preference)
- **Web directory**: `build`

### Step 4: Add Android Platform

```bash
npx cap add android
```

This creates the `android/` folder with Android project files.

### Step 5: Sync Your App

```bash
npx cap sync
```

This copies your web build to the Android project.

### Step 6: Open in Android Studio

```bash
npx cap open android
```

This opens your project in Android Studio.

### Step 7: Build APK in Android Studio

1. Wait for Android Studio to sync and index the project
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for the build to complete (first build may take 5-10 minutes)
4. Click **locate** when build finishes, or find the APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Alternative: Build from Command Line

After Step 5, you can build without Android Studio:

```bash
cd android
./gradlew assembleDebug
```

The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Important Notes

### 1. Update API Endpoint

Your app currently uses `localhost:5000` for the backend. **This won't work on a real device!**

You need to:
- Deploy your backend server (Heroku, Railway, etc.)
- Update the API URL in your code to use the deployed URL

Option: Update the proxy in `package.json` or use environment variables for API URL.

### 2. Firebase Configuration

Make sure your Firebase config in `.env` is correct for production use.

### 3. Release APK (For Google Play)

For a release APK:
1. Generate a keystore
2. Update `capacitor.config.json` with keystore info
3. Build release: `./gradlew assembleRelease`

## One-Command Build (After Setup)

Once Capacitor is initialized, you can use:

```bash
npm run build:android
```

This will:
1. Build your React app
2. Sync with Android
3. Open Android Studio

## Troubleshooting

### "Command not found: cap"
Run: `npm install -g @capacitor/cli` or use `npx cap` instead of `cap`

### "SDK location not found"
Open Android Studio → File → Settings → Appearance & Behavior → System Settings → Android SDK
Copy the Android SDK Location path

### "Java version error"
Install JDK 11 or higher and set JAVA_HOME environment variable

### Build fails in Android Studio
- File → Invalidate Caches / Restart
- Make sure Android SDK is installed
- Update Gradle if prompted

## Where is the APK?

After successful build:

**Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
**Release APK**: `android/app/build/outputs/apk/release/app-release.apk` (if signed)

You can install the debug APK directly on Android devices for testing.

## Next Steps

1. Test the APK on a real Android device
2. Deploy your backend server
3. Update API endpoints to use deployed server
4. Build release APK with proper signing for Google Play Store

Need help? Check the Capacitor docs: https://capacitorjs.com/docs
