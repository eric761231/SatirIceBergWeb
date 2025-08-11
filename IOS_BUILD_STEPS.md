# 🚀 Expo iOS 構建步驟指南

## 📱 專案準備完成！

✅ Expo 專案已創建  
✅ 源碼已複製  
✅ 依賴已安裝  
✅ Web 版本可運行  

## 🔧 下一步：iOS 構建

### 方法 1：使用 Expo 雲端構建服務（推薦）

1. **登入 Expo 帳號**
   ```bash
   npx expo login
   ```

2. **構建 iOS 應用**
   ```bash
   npx expo build:ios
   ```

3. **選擇構建類型**
   - `archive`: 用於 App Store 分發
   - `simulator`: 用於模擬器測試

4. **等待構建完成**
   - 通常需要 10-20 分鐘
   - 構建完成後會提供下載連結

### 方法 2：本地構建（需要 macOS）

1. 將專案複製到 macOS 系統
2. 安裝 Xcode 和 Command Line Tools
3. 運行：`npx expo run:ios`

## 🚨 重要提醒

- **iOS 構建需要 Apple Developer 帳號**
- 免費帳號有設備數量限制
- 付費帳號可以分發到 App Store

## 📋 當前狀態

- 專案位置：`C:\python_training\test_iceberg\SkoposExpo`
- 已安裝依賴：React Navigation、Safe Area Context、Gesture Handler 等
- 源碼已整合：ChatScreen、Sidebar、ChatMessage 等組件

## 🎯 立即開始

在專案目錄中運行：
```bash
npx expo login
npx expo build:ios
```

## 📚 參考資源

- [Expo 官方文檔](https://docs.expo.dev/)
- [iOS 構建指南](https://docs.expo.dev/build/setup/)
- [Apple Developer 文檔](https://developer.apple.com/)

---

**注意**: 這是使用 Expo 構建服務的解決方案，可以在 Windows 上構建 iOS 應用！
