# Expo IPA 建置指南

## 前置需求

1. **Expo 帳戶**：前往 [expo.dev](https://expo.dev) 註冊帳戶
2. **Apple Developer 帳戶**：用於簽署應用程式
3. **EAS CLI**：已安裝完成

## 步驟 1：登入 EAS

```bash
eas login
```

## 步驟 2：配置建置

```bash
eas build:configure
```

## 步驟 3：建置 iOS 應用程式

### 建置開發版本
```bash
eas build --platform ios --profile development
```

### 建置預覽版本
```bash
eas build --platform ios --profile preview
```

### 建置生產版本（IPA）
```bash
eas build --platform ios --profile production
```

## 步驟 4：下載 IPA 檔案

建置完成後，EAS 會提供下載連結，您可以：
1. 在瀏覽器中下載
2. 使用 `eas build:list` 查看建置歷史
3. 使用 `eas build:download` 下載特定建置

## 注意事項

- iOS 建置只能在 macOS 上進行，但 EAS 提供雲端建置服務
- 首次建置可能需要 10-30 分鐘
- 建置完成後會自動簽署，可以直接分發
- 免費帳戶有建置次數限制

## 故障排除

如果遇到問題，請檢查：
1. Expo 帳戶是否正確登入
2. 專案配置是否正確
3. 依賴套件是否相容
4. 網路連線是否穩定
