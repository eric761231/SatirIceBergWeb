# PWA 更新指南

## 更新內容
- 將主頁面改為 `meditation.html`
- 更新所有路徑為相對路徑 (`./`)
- 修正 Service Worker 快取策略
- 新增 PWA 快取清理工具

## 如何清理舊的快取

### 方法一：使用快取清理工具
1. 在瀏覽器中訪問：`https://your-site.netlify.app/pwa-cache-clear.html`
2. 點擊 "清理所有快取" 按鈕
3. 點擊 "註銷 Service Worker" 按鈕
4. 重新載入應用

### 方法二：手動清理
1. **Chrome/Edge**：
   - 按 F12 開啟開發者工具
   - 右鍵點擊重新載入按鈕
   - 選擇 "清空快取並硬性重新載入"

2. **手機瀏覽器**：
   - 設定 → 應用程式 → 您的 PWA → 清除資料
   - 或設定 → 隱私權與安全性 → 清除瀏覽資料

### 方法三：重新安裝 PWA
1. 刪除現有的 PWA 圖標
2. 重新從瀏覽器安裝 PWA

## 測試步驟
1. 清理快取後，重新訪問網站
2. 確認 PWA 直接開啟冥想頁面
3. 測試通知功能是否正常
4. 確認所有路徑都能正確載入

## 技術變更
- `manifest.json`: 設定 `start_url` 為 `./meditation.html`
- `netlify.toml`: 更新路由重定向規則
- `service-worker.js`: 更新快取版本和路徑
- `index.html`: 改為重定向頁面
- 新增 `pwa-cache-clear.html`: 快取清理工具

## 注意事項
- 更新後需要清理舊的快取才能看到新版本
- 如果問題持續，請完全刪除並重新安裝 PWA
- 確保使用 HTTPS 協議訪問網站
