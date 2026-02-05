# 📱 Mobile App Setup Guide - Capacitor

## ✅ Your App is Mobile-Ready!

Your project already has **Capacitor** installed and configured for building native mobile apps for **Android** and **iOS**.

---

## 🚀 Quick Start - Build Mobile App

### **Step 1: Build the Web App for Production**

```bash
cd /home/j-walker/Desktop/businessonline
npm run build
```

This creates an optimized production build in the `build/` folder.

### **Step 2: Sync with Capacitor**

```bash
npx cap sync
```

This copies your production build to the native platform folders.

---

## 📱 **Build for Android**

### **Prerequisites:**
- Android Studio installed
- Android SDK (automatically installed with Android Studio)
- Java Development Kit (JDK)

### **Build Steps:**

```bash
# 1. Open Android project
npx cap open android

# 2. In Android Studio:
#    - Wait for gradle to build
#    - Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
#    - APK will be in: app/release/app-release.apk

# 3. Install on device/emulator:
#    - Click Run → Select emulator/device
#    - Or transfer APK to phone and install
```

### **Installation on Device:**
- Connect Android phone via USB
- Enable Developer Mode (tap Build Number 7 times in Settings)
- APK will auto-install when building from Android Studio

---

## 🍎 **Build for iOS** (Mac Only)

### **Prerequisites:**
- Mac computer with Xcode
- iOS deployment target: 13.0+
- Apple Developer account (for distribution)

### **Build Steps:**

```bash
# 1. Open iOS project
npx cap open ios

# 2. In Xcode:
#    - Select your device/simulator
#    - Click "Play" button to run
#    - Or: Product → Archive → Distribute App

# 3. Install on device:
#    - Development: Use Xcode
#    - Distribution: TestFlight or App Store
```

---

## 🔧 **Configuration Already Done**

Your `capacitor.config.json` is pre-configured:

```json
{
  "appId": "com.businessonline.app",
  "appName": "Business Online",
  "webDir": "build",
  "server": {
    "androidScheme": "https",
    "cleartext": true
  }
}
```

✅ App ID: `com.businessonline.app`
✅ App Name: `Business Online`
✅ Web Directory: `build/` (production build)

---

## 📱 **Android Build - Detailed Steps**

### **Option 1: APK Build (Recommended for Testing)**

```bash
# 1. Build web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open Android Studio
npx cap open android

# 4. In Android Studio:
#    - File → Project → Select app folder
#    - Wait for gradle sync
#    - Build → Build Bundle(s) / APK(s) → Build APK(s)
#    - Find APK: app/release/app-release.apk
```

### **Option 2: Install on Connected Device**

```bash
# Connect Android phone via USB (Developer Mode ON)
npx cap open android

# In Android Studio:
# - Select your device from dropdown
# - Click Run (Play button)
# - App will build and install automatically
```

---

## 🍎 **iOS Build - Detailed Steps**

```bash
# 1. Build web app
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open Xcode
npx cap open ios

# 4. In Xcode:
#    - Select device/simulator (top bar)
#    - Click Play button to build & run
#    - Device must be connected via USB
#    - Or use iOS Simulator (no USB needed)
```

---

## 📲 **Install on Physical Device**

### **Android:**
1. Transfer APK to phone
2. Open file manager on phone
3. Tap APK file
4. Tap "Install"
5. Or enable USB debugging and run from Android Studio

### **iOS:**
1. Connect iPhone via USB
2. In Xcode, select device
3. Click Run button
4. App installs and launches automatically
5. Or use TestFlight for distribution

---

## 🌐 **Configure API URLs**

Your app uses API endpoints. Update for mobile:

### **Development (Local):**
```javascript
// Already configured in your app
// Uses relative URLs: /api/orders, /api/customers, etc.
```

### **Production:**
Update your backend URL in `src/config/firebase.js` or API client:

```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'https://your-api.com';
```

Then build:
```bash
REACT_APP_API_URL=https://your-api.com npm run build
npx cap sync
```

---

## 🔐 **Android Signing (For App Store)**

To distribute on Google Play, you need a signed APK:

```bash
# In Android Studio:
# 1. Build → Generate Signed Bundle / APK
# 2. Select APK
# 3. Create new keystore:
#    - Path: ~/my-release-key.jks
#    - Password: (create strong password)
#    - Alias: my-key-alias
# 4. Build Variant: Release
# 5. Build → Generates signed APK
```

Save your keystore file safely - you'll need it for updates!

---

## 📱 **Testing on Emulator**

### **Android Emulator (Windows/Mac/Linux):**
```bash
# Already included with Android Studio

# In Android Studio:
# 1. AVD Manager → Create Virtual Device
# 2. Select device (e.g., Pixel 4)
# 3. Select Android version (e.g., Android 13)
# 4. Finish and Start
# 5. Run app from Android Studio
```

### **iOS Simulator (Mac Only):**
```bash
# Already included with Xcode

# In Xcode:
# 1. Product → Destination → Select Simulator
# 2. Click Run button
# 3. App builds and runs in simulator
```

---

## ✨ **Features Available in Mobile App**

✅ Full responsive design
✅ Admin Panel (all features)
✅ CRUD operations (Create, Read, Update, Delete)
✅ Search and filtering
✅ Sorting and pagination
✅ Touch-optimized UI
✅ Offline capability (with proper caching)
✅ Native app feel
✅ Access device features (camera, storage, etc.)

---

## 📊 **Build Commands Summary**

```bash
# Prepare production build
npm run build

# Sync with native platforms
npx cap sync                    # Both iOS & Android
npx cap sync android           # Android only
npx cap sync ios              # iOS only

# Open IDEs
npx cap open android          # Open Android Studio
npx cap open ios             # Open Xcode

# Live development
npx cap run android           # Build & run on Android
npx cap run ios              # Build & run on iOS

# Copy web files only
npx cap copy                 # Copy web to native
```

---

## 🆘 **Common Issues & Solutions**

### **Issue: Gradle sync fails**
```bash
# Solution: Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

### **Issue: Pod install fails (iOS)**
```bash
# Solution:
cd ios/App
pod deintegrate
pod install
cd ../..
```

### **Issue: App won't connect to API**
```bash
# Solution: Update API URL in capacitor.config.json
# For development with local server on same network:
"server": {
  "hostname": "192.168.1.100",
  "androidScheme": "http",
  "iosScheme": "http",
  "cleartext": true
}
npx cap sync
```

### **Issue: App crashes on startup**
1. Check logs: Android Studio → Logcat
2. Check console: Xcode → Console
3. Verify API URL is accessible
4. Check Firebase configuration

---

## 📦 **Distribution**

### **Google Play Store (Android):**
1. Create developer account ($25 one-time)
2. Create signed APK (see Android Signing section)
3. Upload APK + screenshots
4. Set pricing, content rating
5. Publish

### **Apple App Store (iOS):**
1. Enroll in Apple Developer Program ($99/year)
2. Create app in App Store Connect
3. Archive app in Xcode
4. Upload via Transporter or Xcode
5. Submit for review
6. Typically 24-48 hours for approval

---

## 🔄 **Update Your App**

### **After making changes:**
```bash
# 1. Make code changes
# 2. Build production version
npm run build

# 3. Sync with native
npx cap sync

# 4. Rebuild in Android Studio / Xcode
# 5. Distribute new version
```

---

## 📚 **Useful Resources**

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Development](https://developer.android.com)
- [iOS Development](https://developer.apple.com)
- [Firebase Setup for Mobile](https://firebase.google.com/docs/ios/setup)

---

## ✅ **Checklist for Mobile Release**

- [ ] Production build completes without errors
- [ ] App installs on test devices
- [ ] All features work on mobile
- [ ] API endpoints are accessible
- [ ] Images and assets load correctly
- [ ] Forms submit properly
- [ ] Login/authentication works
- [ ] Admin panel is functional
- [ ] CRUD operations work
- [ ] App handles offline/connection loss
- [ ] Performance is acceptable
- [ ] No console errors on mobile
- [ ] Tested on multiple devices/versions

---

## 🚀 **Next Steps**

1. **Build:** `npm run build`
2. **Sync:** `npx cap sync`
3. **Open:** `npx cap open android` or `npx cap open ios`
4. **Build:** Use Android Studio or Xcode
5. **Test:** Install on your phone
6. **Distribute:** Follow app store guidelines

**Your business app is ready for mobile!** 📱✨
