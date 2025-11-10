#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
冥想音樂播放器 - 穩定版測試伺服器
處理連接中斷等異常情況，提供更穩定的測試環境
"""

import http.server
import socketserver
import webbrowser
import os
import socket
import threading
import time
import sys
from urllib.parse import urlparse

class StableHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """穩定的 HTTP 請求處理器，處理連接中斷等異常"""
    
    def end_headers(self):
        """設置正確的 MIME 類型，特別是音頻文件"""
        # 獲取文件擴展名
        path = self.path.split('?')[0]  # 移除查詢參數
        if path.endswith('.mp3'):
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Accept-Ranges', 'bytes')  # 支持範圍請求
            self.send_header('Cache-Control', 'public, max-age=3600')
        elif path.endswith('.m4a'):
            self.send_header('Content-Type', 'audio/mp4')
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Cache-Control', 'public, max-age=3600')
        elif path.endswith('.ogg'):
            self.send_header('Content-Type', 'audio/ogg')
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Cache-Control', 'public, max-age=3600')
        super().end_headers()
    
    def handle_one_request(self):
        """處理單個請求，捕獲所有異常"""
        try:
            super().handle_one_request()
        except (BrokenPipeError, ConnectionResetError, OSError) as e:
            # 忽略連接中斷等網路異常
            print(f"⚠️  連接異常（已忽略）: {e}")
        except Exception as e:
            print(f"❌ 處理請求時發生錯誤: {e}")
    
    def copyfile(self, source, outputfile):
        """安全的檔案複製，處理連接中斷"""
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError, OSError) as e:
            # 忽略連接中斷
            print(f"⚠️  檔案傳輸中斷（已忽略）: {e}")
        except Exception as e:
            print(f"❌ 檔案傳輸錯誤: {e}")
    
    def log_message(self, format, *args):
        """自定義日誌格式"""
        # 只記錄重要的請求，減少日誌輸出
        if not args[1].startswith('/favicon.ico'):
            print(f"📡 {args[0]} {args[1]} {args[2]}")

class MeditationMusicServer:
    def __init__(self, port=8000):
        self.port = port
        self.handler = StableHTTPRequestHandler
        self.httpd = None
        
    def get_local_ip(self):
        """獲取本機IP地址"""
        try:
            # 連接到外部地址來獲取本機IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return "127.0.0.1"
    
    def start_server(self):
        """啟動伺服器"""
        try:
            # 設置 socket 選項，提高穩定性
            socketserver.TCPServer.allow_reuse_address = True
            
            with socketserver.TCPServer(("", self.port), self.handler) as httpd:
                self.httpd = httpd
                local_ip = self.get_local_ip()
                
                print("=" * 60)
                print("🧘 冥想音樂播放器 - 穩定版測試伺服器")
                print("=" * 60)
                print(f"📱 手機測試地址：")
                print(f"   http://{local_ip}:{self.port}/meditation.html")
                print(f"   http://{local_ip}:{self.port}/notification-test.html")
                print(f"   http://{local_ip}:{self.port}/public/install-app.html")
                print()
                print(f"💻 電腦測試地址：")
                print(f"   http://localhost:{self.port}/meditation.html")
                print(f"   http://localhost:{self.port}/notification-test.html")
                print(f"   http://localhost:{self.port}/public/install-app.html")
                print()
                print("🔧 測試功能：")
                print("   ✅ PWA 安裝")
                print("   ✅ 推送通知")
                print("   ✅ 冥想提醒")
                print("   ✅ 音樂播放")
                print("   ✅ 拖拽排序")
                print()
                print("📱 手機測試步驟：")
                print("   1. 確保手機和電腦在同一個WiFi網路")
                print("   2. 在手機瀏覽器中輸入上述手機測試地址")
                print("   3. 測試各項功能")
                print()
                print("🔧 伺服器特性：")
                print("   ✅ 自動處理連接中斷")
                print("   ✅ 忽略網路異常")
                print("   ✅ 穩定的檔案傳輸")
                print()
                print("⏹️  按 Ctrl+C 停止伺服器")
                print("=" * 60)
                
                # 自動開啟瀏覽器
                threading.Timer(2.0, self.open_browser).start()
                
                # 啟動伺服器
                print("🚀 伺服器已啟動，等待連接...")
                httpd.serve_forever()
                
        except KeyboardInterrupt:
            print("\n\n🛑 伺服器已停止")
        except Exception as e:
            print(f"❌ 啟動伺服器失敗：{e}")
            print("💡 請檢查端口是否被佔用，或嘗試其他端口")
    
    def open_browser(self):
        """自動開啟瀏覽器"""
        try:
            webbrowser.open(f"http://localhost:{self.port}/meditation.html")
        except:
            pass
    
    def stop_server(self):
        """停止伺服器"""
        if self.httpd:
            self.httpd.shutdown()

def check_port_available(port):
    """檢查端口是否可用"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', port))
            return True
    except OSError:
        return False

def find_available_port(start_port=8000):
    """尋找可用的端口"""
    port = start_port
    while port < start_port + 100:
        if check_port_available(port):
            return port
        port += 1
    return None

def main():
    """主函數"""
    print("🔍 正在檢查可用端口...")
    
    # 尋找可用端口
    port = find_available_port(8000)
    if not port:
        print("❌ 無法找到可用端口")
        return
    
    if port != 8000:
        print(f"⚠️  端口 8000 被佔用，使用端口 {port}")
    
    server = MeditationMusicServer(port)
    
    try:
        server.start_server()
    except KeyboardInterrupt:
        print("\n正在關閉伺服器...")
        server.stop_server()

if __name__ == "__main__":
    main()
