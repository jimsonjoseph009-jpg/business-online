#!/bin/bash

# Mobile App Build Script
# Usage: ./build-mobile.sh [android|ios|both]

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_TYPE=${1:-both}

echo "🚀 Business Online - Mobile Build Script"
echo "========================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build for web
echo ""
echo "🔨 Building production web app..."
npm run build

# Sync with Capacitor
echo ""
echo "🔄 Syncing with Capacitor..."
npx cap sync

# Build Android if requested
if [ "$BUILD_TYPE" = "android" ] || [ "$BUILD_TYPE" = "both" ]; then
    echo ""
    echo "📱 Building for Android..."
    echo "Opening Android Studio..."
    npx cap open android
    echo ""
    echo "Next steps for Android:"
    echo "1. Wait for Gradle to sync"
    echo "2. Click Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "3. APK will be in: app/release/app-release.apk"
    echo "4. Transfer to device or install from Android Studio"
fi

# Build iOS if requested
if [ "$BUILD_TYPE" = "ios" ] || [ "$BUILD_TYPE" = "both" ]; then
    echo ""
    echo "🍎 Building for iOS..."
    echo "Opening Xcode..."
    npx cap open ios
    echo ""
    echo "Next steps for iOS:"
    echo "1. Select your device/simulator at top"
    echo "2. Click the Play button (Run)"
    echo "3. App will build and install automatically"
fi

if [ "$BUILD_TYPE" = "both" ]; then
    echo ""
    echo "✅ Both platforms ready!"
    echo "- Android: See instructions above"
    echo "- iOS: See instructions above"
fi

echo ""
echo "✨ Build complete!"
