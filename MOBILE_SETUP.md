# Building Android APK from Web App

This guide explains how to convert your React web app into an Android APK using Capacitor.

## Option 1: Using Capacitor (Recommended)

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### Step 2: Initialize Capacitor

```bash
npx cap init
```

When prompted:
- App name: `Business Online`
- App ID: `com.businessonline.app` (or your preferred package name)
- Web directory: `build`

### Step 3: Build your React app

```bash
npm run build
```

### Step 4: Add Android platform

```bash
npx cap add android
```

### Step 5: Sync web assets

```bash
npx cap sync
```

### Step 6: Open in Android Studio

```bash
npx cap open android
```

### Step 7: Build APK in Android Studio

1. Open Android Studio (install if needed)
2. Click "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)"
3. Wait for the build to complete
4. The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Option 2: Build APK from Command Line

After setting up Capacitor:

```bash
cd android
./gradlew assembleDebug
```

The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Requirements

- **Java JDK 11 or higher** - Install from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
- **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
- **Android SDK** - Installed via Android Studio

## Important Notes

1. **API Endpoint**: Update your API endpoint in the code to use your deployed backend URL, not `localhost:5000`

2. **Firebase Config**: Make sure your Firebase configuration works for production

3. **Permissions**: Update `android/app/src/main/AndroidManifest.xml` if you need special permissions (camera, location, etc.)

4. **Production Build**: For a release APK, use `./gradlew assembleRelease` and sign it with a keystore

## Quick Setup Script

I can add Capacitor configuration to your project. Would you like me to:
1. Add Capacitor dependencies
2. Create the capacitor.config.json
3. Update your build process

Let me know if you'd like me to set this up automatically!
