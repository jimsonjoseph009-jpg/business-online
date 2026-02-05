# 📱 Mobile App Quick Reference

## 🚀 Build Your Mobile App - 3 Simple Commands

### **Option 1: Automatic Script (Easiest)**

```bash
cd /home/j-walker/Desktop/businessonline
./build-mobile.sh android    # Android only
./build-mobile.sh ios        # iOS only  
./build-mobile.sh both       # Both (Mac only)
```

This script automatically:
1. ✅ Builds production web app
2. ✅ Syncs with Capacitor
3. ✅ Opens Android Studio or Xcode
4. ✅ Guides you through the build process

---

### **Option 2: Manual Steps**

```bash
# 1. Build web app
npm run build

# 2. Sync with Capacitor
npx cap sync

# 3. Open your IDE
npx cap open android    # Android Studio
npx cap open ios        # Xcode
```

---

### **Option 3: Direct Commands**

```bash
# All-in-one for Android
npm run build && npx cap sync && npx cap open android

# All-in-one for iOS
npm run build && npx cap sync && npx cap open ios
```

---

## 📱 **Android Setup (Quickest)**

### **What you need:**
- ✅ Android Studio (free)
- ✅ USB cable for testing
- ✅ Android phone (or emulator)

### **Build & Install:**

```bash
./build-mobile.sh android
```

Then in Android Studio:
1. Wait for Gradle to finish
2. Click **Build** menu
3. Select **Build Bundle(s) / APK(s)**
4. Click **Build APK(s)**
5. Connect your phone via USB
6. Click **Run** button
7. Select your device
8. App installs automatically!

---

## 🍎 **iOS Setup (Mac Only)**

### **What you need:**
- ✅ Mac computer
- ✅ Xcode (free from App Store)
- ✅ iPhone or iPad
- ✅ Lightning/USB-C cable

### **Build & Install:**

```bash
./build-mobile.sh ios
```

Then in Xcode:
1. Connect iPhone via USB
2. Select device at top (next to Play button)
3. Click **Play** button
4. Xcode builds and installs automatically
5. App opens on your iPhone!

---

## 📲 **Quick Tips**

### **Enable Developer Mode (Android)**
1. Open Settings
2. Scroll to "About phone"
3. Tap "Build Number" **7 times**
4. Go back to Settings
5. Find "Developer Options"
6. Enable "USB Debugging"

### **Enable Developer Mode (iOS)**
1. Connect to Mac via USB
2. Trust computer when prompted
3. Xcode will automatically prepare device

---

## 🔄 **Update After Code Changes**

```bash
# Made changes to your app? Rebuild:
npm run build
npx cap sync
# Then rebuild in Android Studio or Xcode
```

---

## ✅ **What Works on Mobile**

✅ Admin Panel (all 6 tabs)
✅ Orders management
✅ Customers management
✅ Products management
✅ Messages management
✅ Notifications & Reviews
✅ Search & filtering
✅ Sorting & pagination
✅ Bulk delete
✅ Touch-optimized UI
✅ Responsive design
✅ Dark/Light theme
✅ Multi-language support
✅ All your features!

---

## 📊 **File Locations**

```
Build output:     build/
Android project:  android/
iOS project:      ios/
Config:           capacitor.config.json
```

---

## 🆘 **Troubleshooting**

### **Issue: "Command not found: npm"**
- Solution: Install Node.js from nodejs.org

### **Issue: "Android Studio not found"**
- Solution: Download from android.com/studio

### **Issue: "Pod install failed" (iOS)**
```bash
cd ios/App
pod repo update
pod install
cd ../..
```

### **Issue: App won't run on device**
1. Check internet connection
2. Ensure USB debugging is enabled (Android)
3. Trust computer (iOS)
4. Verify phone is connected: `adb devices` (Android)

### **Issue: API doesn't work on mobile**
- Make sure backend server is running
- Check API URL configuration
- For testing: Use your computer's IP address

---

## 🌐 **API Configuration for Mobile**

Your app connects to backend API. Options:

### **Development (Local Network)**
```bash
# Run backend server on your computer
# Phone connects via IP: 192.168.1.100:5000

./build-mobile.sh android
# App will use backend from your network
```

### **Production**
```bash
# Update API URL in environment variables:
REACT_APP_API_URL=https://your-api.com npm run build
npx cap sync
./build-mobile.sh android
```

---

## 📦 **Distribution**

### **Google Play (Android)**
1. Create signed APK
2. Create Play Store account ($25)
3. Upload APK + screenshots
4. Publish!

### **App Store (iOS)**
1. Archive app in Xcode
2. Apple Developer account ($99/year)
3. Upload via TestFlight
4. Submit for review
5. Wait for approval

---

## 🎯 **Your App is Ready!**

Your Business Online app is production-ready for mobile. Choose your platform and start building:

```bash
# Android users:
./build-mobile.sh android

# iOS users:
./build-mobile.sh ios

# Both (Mac):
./build-mobile.sh both
```

**That's it!** Your app will be on your phone in minutes! 📱✨

---

## 📚 **Full Documentation**

See `MOBILE_APP_SETUP.md` for detailed guides on:
- Android signing & distribution
- iOS App Store deployment
- Detailed build instructions
- Common issues & solutions
- API configuration
- Feature availability

**Start building your mobile app now!** 🚀
