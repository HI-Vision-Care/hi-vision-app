# Script PowerShell để build và submit iOS lên TestFlight
# Usage: .\scripts\build-ios.ps1 [-Submit]

param(
    [switch]$Submit
)

Write-Host "🚀 Bắt đầu build iOS..." -ForegroundColor Cyan

# Kiểm tra đã login EAS chưa
$whoami = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Chưa login EAS. Đang login..." -ForegroundColor Yellow
    eas login
}

# Kiểm tra version hiện tại
$appJson = Get-Content "app.json" | ConvertFrom-Json
$version = $appJson.expo.version
Write-Host "📱 Version hiện tại: $version" -ForegroundColor Green

# Build iOS
if ($Submit) {
    Write-Host "📦 Building và tự động submit lên TestFlight..." -ForegroundColor Cyan
    eas build --platform ios --profile production --auto-submit
} else {
    Write-Host "📦 Building iOS (chưa submit)..." -ForegroundColor Cyan
    eas build --platform ios --profile production
    
    Write-Host ""
    Write-Host "✅ Build đã bắt đầu!" -ForegroundColor Green
    Write-Host "📊 Theo dõi build tại: https://expo.dev/accounts/kimcu142/projects/hi-vision/builds" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Để submit sau khi build xong, chạy:" -ForegroundColor Yellow
    Write-Host "   eas submit --platform ios --latest" -ForegroundColor White
}

