// PWA 配置文件
const PWA_CONFIG = {
    // 應用基本信息
    app: {
        name: 'Obyssey',
        shortName: 'Obyssey',
        description: '基於薩提爾冰山理論的AI療癒對話系統，深入探索內在世界',
        version: '1.0.0',
        author: 'Obyssey Team'
    },
    
    // 安裝配置
    install: {
        promptDelay: 3000, // 延遲顯示安裝提示的時間（毫秒）
        showInstallButton: true, // 是否顯示安裝按鈕
        installButtonText: '安裝App',
        installButtonTextInstalled: '已安裝',
        installButtonTextUnsupported: '不支援'
    },
    
    // 主題配置
    theme: {
        primaryColor: '#3498db',
        secondaryColor: '#2c3e50',
        backgroundColor: '#ecf0f1',
        textColor: '#222',
        borderRadius: '16px',
        shadow: '0 4px 24px rgba(0,0,0,0.08)'
    },
    
    // 功能配置
    features: {
        offlineSupport: true,
        pushNotifications: false,
        backgroundSync: false,
        fileHandling: false
    },
    
    // 緩存配置
    cache: {
        strategy: 'cache-first', // cache-first, network-first, stale-while-revalidate
        maxAge: 86400000, // 24小時
        maxEntries: 100
    },
    
    // 更新配置
    update: {
        checkInterval: 3600000, // 1小時檢查一次更新
        showUpdatePrompt: true,
        updateButtonText: '更新可用',
        updateButtonTextUpdating: '更新中...'
    }
};

// 導出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWA_CONFIG;
} else if (typeof window !== 'undefined') {
    window.PWA_CONFIG = PWA_CONFIG;
}

// PWA 安裝管理器
class PWAInstallManager {
    constructor(config = PWA_CONFIG) {
        this.config = config;
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }
    
    init() {
        this.checkInstallationStatus();
        this.setupEventListeners();
        this.setupServiceWorker();
    }
    
    // 檢查安裝狀態
    checkInstallationStatus() {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
        }
        
        // 檢查是否已安裝到主畫面
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
        }
    }
    
    // 設置事件監聽器
    setupEventListeners() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstallationSuccess();
        });
    }
    
    // 設置 Service Worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('ServiceWorker 註冊成功:', registration);
                    this.setupUpdateChecking(registration);
                })
                .catch((error) => {
                    console.log('ServiceWorker 註冊失敗:', error);
                });
        }
    }
    
    // 設置更新檢查
    setupUpdateChecking(registration) {
        if (this.config.update.showUpdatePrompt) {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdatePrompt();
                    }
                });
            });
        }
    }
    
    // 顯示安裝按鈕
    showInstallButton() {
        if (this.config.install.showInstallButton && !this.isInstalled) {
            const installBtn = document.getElementById('installAppBtn');
            if (installBtn) {
                installBtn.style.display = 'inline-block';
                installBtn.addEventListener('click', () => this.installApp());
            }
        }
    }
    
    // 隱藏安裝按鈕
    hideInstallButton() {
        const installBtn = document.getElementById('installAppBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }
    
    // 安裝應用
    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const choiceResult = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('用戶接受了安裝提示');
            } else {
                console.log('用戶拒絕了安裝提示');
            }
        } else {
            this.showManualInstallInstructions();
        }
    }
    
    // 顯示手動安裝說明
    showManualInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let message = '請使用支援PWA的瀏覽器，或已安裝/不支援安裝提示';
        
        if (isIOS) {
            message = '請點選 Safari 下方的「分享」按鈕，然後選擇「加入主畫面」';
        } else if (isAndroid) {
            message = '請點選瀏覽器選單中的「安裝 App」選項';
        }
        
        alert(message);
    }
    
    // 顯示安裝成功提示
    showInstallationSuccess() {
        // 可以顯示一個優雅的提示或通知
        console.log('Obyssey App 安裝成功！');
    }
    
    // 顯示更新提示
    showUpdatePrompt() {
        if (this.config.update.showUpdatePrompt) {
            const updateBtn = document.createElement('button');
            updateBtn.textContent = this.config.update.updateButtonText;
            updateBtn.className = 'update-app-btn';
            updateBtn.addEventListener('click', () => this.updateApp());
            
            // 將更新按鈕添加到頁面
            const container = document.querySelector('.container');
            if (container) {
                container.appendChild(updateBtn);
            }
        }
    }
    
    // 更新應用
    updateApp() {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }
}

// 自動初始化 PWA 安裝管理器
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.pwaManager = new PWAInstallManager();
    });
}
