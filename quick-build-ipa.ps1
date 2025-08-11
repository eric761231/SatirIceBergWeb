# 快速 IPA 構建腳本
# 直接開始 iOS 應用構建

Write-Host "🚀 快速 IPA 構建" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""

Write-Host "📱 專案：SkoposExpo" -ForegroundColor Cyan
Write-Host "🎯 目標：生成 IPA 檔案" -ForegroundColor Cyan
Write-Host ""

# 檢查登入狀態
Write-Host "📋 檢查登入狀態..." -ForegroundColor Blue
$loginStatus = npx expo whoami 2>&1

if ($loginStatus -like "*Not logged in*") {
    Write-Host "⚠️  未登入，嘗試自動登入..." -ForegroundColor Yellow
    Write-Host "請在瀏覽器中完成登入流程" -ForegroundColor Yellow
    npx expo login
} else {
    Write-Host "✅ 已登入：$loginStatus" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 開始構建 archive 版本（用於分發）..." -ForegroundColor Green
Write-Host "構建時間：約 10-20 分鐘" -ForegroundColor Yellow
Write-Host ""

# 開始構建
Write-Host "🚀 執行：npx expo build:ios --type archive" -ForegroundColor Cyan
npx expo build:ios --type archive

Write-Host ""
Write-Host "🎉 構建完成！" -ForegroundColor Green
Write-Host "請檢查上面的輸出，找到 IPA 下載連結" -ForegroundColor Yellow
