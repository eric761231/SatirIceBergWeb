# Obyssey 配置系統說明

## 概述

本次更新為 Obyssey PWA 應用引入了全新的配置系統，提供了更好的可維護性、靈活性和用戶體驗。

## 新增配置文件

### 1. `public/pwa-config.js`
PWA 核心配置文件，包含：
- PWA 安裝管理器類
- 自動安裝檢測
- 智能安裝提示
- 更新檢查機制
- 跨平台安裝指導

### 2. `app-config.json`
應用整體配置文件，包含：
- 應用基本信息
- PWA 設置
- 功能開關
- 緩存策略
- UI 主題
- API 配置
- 安全設置
- 性能優化
- 本地化設置
- 無障礙功能

### 3. `public/service-worker.js`
增強版 Service Worker，提供：
- 多層緩存策略
- 離線支持
- 智能資源管理
- 推送通知支持
- 後台同步
- 錯誤處理

## 配置特點

### 🚀 智能安裝
- 自動檢測安裝狀態
- 根據平台提供相應安裝指導
- 延遲顯示安裝提示，避免干擾用戶

### 📱 跨平台支持
- iOS Safari 優化
- Android Chrome 優化
- 響應式設計適配

### 🔧 靈活配置
- 模塊化配置結構
- 環境相關配置
- 功能開關控制

### 🎨 主題系統
- 統一的主題配置
- 支持深色/淺色模式
- 自定義顏色和樣式

### 📊 性能優化
- 多種緩存策略
- 資源預加載
- 圖片優化
- 代碼分割

## 使用方法

### 基本使用
```html
<!-- 在 HTML 中引入配置 -->
<script src="/pwa-config.js"></script>
```

### 自定義配置
```javascript
// 修改 PWA 配置
window.PWA_CONFIG.install.promptDelay = 5000;
window.PWA_CONFIG.theme.primaryColor = '#e74c3c';

// 重新初始化
window.pwaManager = new PWAInstallManager(window.PWA_CONFIG);
```

### 配置驗證
```javascript
// 檢查配置是否正確加載
if (window.PWA_CONFIG) {
    console.log('PWA 配置已加載:', window.PWA_CONFIG);
}

if (window.pwaManager) {
    console.log('PWA 管理器已初始化');
}
```

## 配置選項說明

### 安裝配置
- `promptDelay`: 安裝提示延遲時間（毫秒）
- `showInstallButton`: 是否顯示安裝按鈕
- `installButtonText`: 安裝按鈕文字

### 主題配置
- `primaryColor`: 主色調
- `secondaryColor`: 次要色調
- `backgroundColor`: 背景色
- `textColor`: 文字色
- `borderRadius`: 圓角大小
- `shadow`: 陰影效果

### 緩存配置
- `strategy`: 緩存策略（cache-first, network-first, stale-while-revalidate）
- `maxAge`: 緩存最大年齡
- `maxEntries`: 最大緩存條目數

### 功能配置
- `offlineSupport`: 離線支持
- `pushNotifications`: 推送通知
- `backgroundSync`: 後台同步
- `fileHandling`: 文件處理

## 更新日誌

### v1.0.0 (當前版本)
- ✅ 新增 PWA 配置系統
- ✅ 智能安裝管理器
- ✅ 增強版 Service Worker
- ✅ 統一配置管理
- ✅ 跨平台安裝支持
- ✅ 主題系統
- ✅ 性能優化

## 技術要求

- 現代瀏覽器支持
- HTTPS 環境（PWA 要求）
- Service Worker 支持
- 本地存儲支持

## 故障排除

### 安裝按鈕不顯示
1. 檢查瀏覽器是否支持 PWA
2. 確認 HTTPS 環境
3. 檢查 Service Worker 註冊狀態

### 緩存不生效
1. 檢查 Service Worker 是否激活
2. 確認緩存策略配置
3. 清除舊緩存

### 配置不生效
1. 檢查配置文件路徑
2. 確認 JavaScript 錯誤
3. 重新加載頁面

## 未來計劃

- [ ] 配置熱重載
- [ ] 配置版本管理
- [ ] 配置備份恢復
- [ ] 配置同步
- [ ] 更多主題選項
- [ ] 用戶自定義配置

## 支持

如有問題或建議，請聯繫：
- 郵箱：support@obyssey.com
- 網站：https://satir-ice-berg-web.vercel.app/

---

*本配置系統專為 Obyssey PWA 應用設計，提供最佳的用戶體驗和開發體驗。*
