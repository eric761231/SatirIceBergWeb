# iOS Build Guide for Expo Project
# This script will guide you through the iOS build process

Write-Host "🚀 Expo iOS 構建指南" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host ""

Write-Host "📱 專案準備完成！" -ForegroundColor Green
Write-Host "✅ Expo 專案已創建" -ForegroundColor Green
Write-Host "✅ 源碼已複製" -ForegroundColor Green
Write-Host "✅ 依賴已安裝" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 下一步：iOS 構建" -ForegroundColor Yellow
Write-Host ""

Write-Host "方法 1：使用 Expo 雲端構建服務（推薦）" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "1. 登入 Expo 帳號：" -ForegroundColor White
Write-Host "   npx expo login" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 構建 iOS 應用：" -ForegroundColor White
Write-Host "   npx expo build:ios" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 選擇構建類型：" -ForegroundColor White
Write-Host "   - archive: 用於 App Store 分發" -ForegroundColor Gray
Write-Host "   - simulator: 用於模擬器測試" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 等待構建完成（通常需要 10-20 分鐘）" -ForegroundColor White
Write-Host ""

Write-Host "方法 2：本地構建（需要 macOS）" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "1. 將專案複製到 macOS 系統" -ForegroundColor White
Write-Host "2. 安裝 Xcode 和 Command Line Tools" -ForegroundColor White
Write-Host "3. 運行：npx expo run:ios" -ForegroundColor White
Write-Host ""

Write-Host "🚨 重要提醒：" -ForegroundColor Red
Write-Host "- iOS 構建需要 Apple Developer 帳號" -ForegroundColor White
Write-Host "- 免費帳號有設備數量限制" -ForegroundColor White
Write-Host "- 付費帳號可以分發到 App Store" -ForegroundColor White
Write-Host ""

Write-Host "🎯 現在開始構建..." -ForegroundColor Green
Write-Host ""

# 檢查是否已登入 Expo
$choice = Read-Host "是否要現在開始 iOS 構建？(y/n)"
if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host "🚀 開始 iOS 構建流程..." -ForegroundColor Green
    
    # 檢查是否已登入
    Write-Host "📋 檢查 Expo 登入狀態..." -ForegroundColor Blue
    npx expo whoami
    
    Write-Host ""
    Write-Host "📱 開始構建 iOS 應用..." -ForegroundColor Green
    Write-Host "這將使用 Expo 的雲端構建服務" -ForegroundColor Yellow
    
    # 開始構建
    npx expo build:ios
} else {
    Write-Host "📚 請稍後手動運行：npx expo build:ios" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 腳本執行完成！" -ForegroundColor Green
Write-Host "如有問題，請參考 Expo 官方文檔" -ForegroundColor Cyan
