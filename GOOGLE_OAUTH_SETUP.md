# Google OAuth 設定指南

## 🔧 設定步驟

### 1. 建立 Google Cloud 專案
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊「建立專案」或選擇現有專案
3. 記錄專案 ID

### 2. 啟用 Google Identity Services
1. 在 Google Cloud Console 中，前往「API 和服務」→「程式庫」
2. 搜尋「Google Identity Services」
3. 點擊啟用

### 3. 建立 OAuth 2.0 憑證
1. 前往「API 和服務」→「憑證」
2. 點擊「建立憑證」→「OAuth 2.0 用戶端 ID」
3. 選擇「網路應用程式」
4. 設定授權的 JavaScript 來源：
   - 開發環境：`http://localhost:3000`（或您的本地端口）
   - 生產環境：`https://your-domain.vercel.app`
5. 設定授權的重新導向 URI：
   - `https://your-domain.vercel.app/index.html`
6. 複製生成的「用戶端 ID」

### 4. 更新程式碼
在 `index.html` 中找到以下行：
```javascript
client_id: "YOUR_GOOGLE_CLIENT_ID", // 需要替換為實際的 Google Client ID
```

將 `YOUR_GOOGLE_CLIENT_ID` 替換為您在步驟 3 中獲得的用戶端 ID。

### 5. 設定網域驗證
1. 在 Google Cloud Console 的憑證頁面
2. 點擊您的 OAuth 2.0 用戶端 ID
3. 在「授權的 JavaScript 來源」中添加您的網域

## 🌐 支援的網域格式
- `http://localhost:8080`
- `https://your-app.vercel.app`
- `https://your-custom-domain.com`

## 🔒 安全性注意事項
- 用戶端 ID 可以公開，不需要隱藏
- 永遠不要在前端程式碼中暴露用戶端密鑰
- 定期檢查和更新授權網域清單

## 🧪 測試設定
1. 在瀏覽器中開啟您的應用
2. 點擊 Google 登入按鈕
3. 確認可以正常登入並看到用戶信息

## ❌ 常見問題
- **Error 400: redirect_uri_mismatch**：檢查授權的重新導向 URI 設定
- **Error 403: access_blocked**：檢查 OAuth 同意畫面設定
- **Google 登入按鈕不顯示**：檢查網路連線和 JavaScript 載入

## 📝 開發注意事項
- 在開發階段可以先使用訪客模式測試功能
- Google OAuth 需要 HTTPS（本地開發可使用 HTTP）
- 建議在生產環境中設定 OAuth 同意畫面
