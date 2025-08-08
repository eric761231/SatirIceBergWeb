# 📱 PWA 圖標生成指南

## 🎨 需要的圖標尺寸

創建以下尺寸的 PNG 圖標，放在 `/icons/` 目錄中：

- `icon-72x72.png` - 72x72 像素
- `icon-96x96.png` - 96x96 像素  
- `icon-128x128.png` - 128x128 像素
- `icon-144x144.png` - 144x144 像素
- `icon-152x152.png` - 152x152 像素
- `icon-192x192.png` - 192x192 像素
- `icon-384x384.png` - 384x384 像素
- `icon-512x512.png` - 512x512 像素

## 🔧 圖標設計建議

### 基本要求
- 使用冰山 🧊 emoji 或自訂設計
- 背景色：`#2c3e50`（深藍灰色）
- 圖標色：`#ecf0f1`（淺灰色）或白色
- 圓角：建議 20% 的圓角半徑

### 設計工具推薦
1. **Canva** - 線上設計工具
2. **Figma** - 專業設計工具
3. **PWA Builder** - 微軟的 PWA 圖標生成器
4. **Favicon Generator** - 線上圖標生成器

## 🚀 快速生成方案

### 方案 1：使用 Emoji
1. 創建 512x512 的畫布
2. 背景設為 `#2c3e50`
3. 放置大號 🧊 emoji
4. 導出為 PNG
5. 使用線上工具調整為其他尺寸

### 方案 2：使用線上工具
訪問以下網站自動生成所有尺寸：
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/favicon-generator/

## 📂 檔案結構
```
icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
├── icon-512x512.png
├── shortcut-chat.png (96x96)
└── shortcut-settings.png (96x96)
```

## ✅ 檢查清單
- [ ] 所有圖標都是正方形
- [ ] 背景不透明
- [ ] 圖標清晰可見
- [ ] 在深色和淺色主題下都好看
- [ ] 符合品牌風格

生成圖標後，PWA 就可以安裝到手機桌面了！
