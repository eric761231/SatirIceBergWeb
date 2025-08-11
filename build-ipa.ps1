# IPA 構建腳本
# 自動化 iOS 應用構建流程

Write-Host "🚀 開始 IPA 構建流程..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# 檢查是否已登入
Write-Host "📋 檢查 Expo 登入狀態..." -ForegroundColor Blue
$loginStatus = npx expo whoami 2>&1

if ($loginStatus -like "*Not logged in*") {
    Write-Host "❌ 未登入 Expo 帳號" -ForegroundColor Red
    Write-Host "請先註冊並登入 Expo 帳號：" -ForegroundColor Yellow
    Write-Host "npx expo register" -ForegroundColor Gray
    Write-Host "npx expo login" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ 已登入 Expo 帳號：$loginStatus" -ForegroundColor Green
Write-Host ""

# 檢查專案配置
Write-Host "🔍 檢查專案配置..." -ForegroundColor Blue
if (!(Test-Path "app.json")) {
    Write-Host "❌ 找不到 app.json 配置文件" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 專案配置檢查通過" -ForegroundColor Green
Write-Host ""

# 開始構建
Write-Host "📱 開始構建 iOS 應用..." -ForegroundColor Green
Write-Host "這將使用 Expo 的雲端構建服務" -ForegroundColor Yellow
Write-Host "構建過程通常需要 10-20 分鐘" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎯 構建選項：" -ForegroundColor Cyan
Write-Host "1. archive - 用於 App Store 分發（推薦）" -ForegroundColor White
Write-Host "2. simulator - 用於模擬器測試" -ForegroundColor White
Write-Host ""

$buildType = Read-Host "請選擇構建類型 (1 或 2)"
if ($buildType -eq "1") {
    $buildType = "archive"
} elseif ($buildType -eq "2") {
    $buildType = "simulator"
} else {
    Write-Host "使用預設構建類型：archive" -ForegroundColor Yellow
    $buildType = "archive"
}

Write-Host ""
Write-Host "🚀 開始構建 $buildType 版本..." -ForegroundColor Green
Write-Host "請耐心等待，構建完成後會提供下載連結" -ForegroundColor Yellow
Write-Host ""

# 執行構建
try {
    npx expo build:ios --type $buildType
    Write-Host ""
    Write-Host "🎉 構建完成！" -ForegroundColor Green
    Write-Host "請檢查上面的輸出，找到下載連結" -ForegroundColor Yellow
} catch {
    Write-Host "❌ 構建過程中出現錯誤" -ForegroundColor Red
    Write-Host "錯誤詳情：$($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 常見解決方案：" -ForegroundColor Cyan
    Write-Host "1. 檢查網路連接" -ForegroundColor White
    Write-Host "2. 確認 Apple Developer 帳號有效" -ForegroundColor White
    Write-Host "3. 檢查專案配置是否正確" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 構建完成後：" -ForegroundColor Cyan
Write-Host "- 下載 .ipa 檔案" -ForegroundColor White
Write-Host "- 使用 iTunes 或 Finder 安裝到 iOS 設備" -ForegroundColor White
Write-Host "- 或使用 TestFlight 進行分發測試" -ForegroundColor White
