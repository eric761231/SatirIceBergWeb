@echo off
chcp 65001 >nul
title 冥想音樂播放器 - 穩定版測試伺服器

echo.
echo 🧘 正在啟動冥想音樂播放器穩定版測試伺服器...
echo.
echo 💡 此版本會自動處理連接中斷等網路異常
echo.

python start_server_stable.py

pause
