#!/bin/bash

# Script để build và submit iOS lên TestFlight
# Usage: ./scripts/build-ios.sh [--submit]

echo "🚀 Bắt đầu build iOS..."

# Kiểm tra đã login EAS chưa
if ! eas whoami &> /dev/null; then
    echo "❌ Chưa login EAS. Đang login..."
    eas login
fi

# Kiểm tra version hiện tại
VERSION=$(node -p "require('./app.json').expo.version")
echo "📱 Version hiện tại: $VERSION"

# Build iOS
if [ "$1" == "--submit" ]; then
    echo "📦 Building và tự động submit lên TestFlight..."
    eas build --platform ios --profile production --auto-submit
else
    echo "📦 Building iOS (chưa submit)..."
    eas build --platform ios --profile production
    
    echo ""
    echo "✅ Build đã bắt đầu!"
    echo "📊 Theo dõi build tại: https://expo.dev/accounts/kimcu142/projects/hi-vision/builds"
    echo ""
    echo "💡 Để submit sau khi build xong, chạy:"
    echo "   eas submit --platform ios --latest"
fi

