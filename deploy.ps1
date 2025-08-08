# PWA 部署腳本
# 使用方法: .\deploy.ps1 "提交訊息"

param(
    [string]$CommitMessage = "更新 PWA 功能"
)

Write-Host "🚀 開始部署 PWA 應用..." -ForegroundColor Green

# 檢查是否在正確的目錄
if (!(Test-Path "manifest.json")) {
    Write-Host "❌ 錯誤：請在專案根目錄執行此腳本" -ForegroundColor Red
    exit 1
}

# 檢查 Git 狀態
Write-Host "📋 檢查 Git 狀態..." -ForegroundColor Yellow
git status

# 添加所有變更
Write-Host "➕ 添加檔案到 Git..." -ForegroundColor Yellow
git add .

# 提交變更
Write-Host "💾 提交變更..." -ForegroundColor Yellow
git commit -m $CommitMessage

# 推送到 GitHub
Write-Host "📤 推送到 GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "🌐 你的 PWA 應用將在幾分鐘內更新" -ForegroundColor Cyan
Write-Host "📱 記得在手機上測試安裝功能" -ForegroundColor Cyan

# 檢查 PWA 功能
Write-Host "`n🔍 PWA 功能檢查清單:" -ForegroundColor Magenta
Write-Host "□ manifest.json 已配置" -ForegroundColor White
Write-Host "□ Service Worker 已註冊" -ForegroundColor White
Write-Host "□ 圖標檔案已生成" -ForegroundColor White
Write-Host "□ HTTPS 部署完成" -ForegroundColor White
Write-Host "□ 手機測試安裝" -ForegroundColor White

Write-Host "`n📚 使用指南:" -ForegroundColor Blue
Write-Host "1. 打開 icon-generator.html 生成圖標" -ForegroundColor White
Write-Host "2. 解壓縮圖標到 icons/ 資料夾" -ForegroundColor White
Write-Host "3. 在手機 Chrome 瀏覽器開啟網站" -ForegroundColor White
Write-Host "4. 點擊 '安裝應用' 按鈕" -ForegroundColor White
Write-Host "5. 從桌面啟動應用" -ForegroundColor White
