// PWA 配置和推送通知模擬 API

// 模擬推送通知 API
class PushNotificationAPI {
  constructor() {
    this.subscriptions = new Map();
    this.notificationQueue = [];
  }

  // 模擬發送推送通知
  async sendNotification(subscription, notification) {
    try {
      // 在實際應用中，這裡會發送真正的推送通知
      console.log('模擬發送推送通知:', {
        subscription: subscription.endpoint,
        notification: notification
      });

      // 模擬網路延遲
      await new Promise(resolve => setTimeout(resolve, 100));

      // 儲存訂閱資訊
      this.subscriptions.set(subscription.endpoint, {
        subscription: subscription,
        lastNotification: Date.now()
      });

      // 模擬成功回應
      return {
        success: true,
        message: '推送通知已發送',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('發送推送通知失敗:', error);
      return {
        success: false,
        message: '發送失敗',
        error: error.message
      };
    }
  }

  // 獲取所有訂閱
  getSubscriptions() {
    return Array.from(this.subscriptions.values());
  }

  // 移除訂閱
  removeSubscription(endpoint) {
    return this.subscriptions.delete(endpoint);
  }
}

// 創建全局實例
window.pushNotificationAPI = new PushNotificationAPI();

// 模擬 API 端點
window.mockAPI = {
  // 發送通知端點
  '/api/send-notification': async (requestData) => {
    const { subscription, notification } = requestData;
    
    try {
      const result = await window.pushNotificationAPI.sendNotification(subscription, notification);
      
      if (result.success) {
        // 模擬瀏覽器推送通知
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.showNotification(notification.title, {
              body: notification.body,
              icon: notification.icon,
              badge: notification.badge,
              tag: notification.tag,
              requireInteraction: notification.requireInteraction,
              actions: notification.actions,
              data: notification.data
            });
          }
        }
        
        return {
          status: 200,
          body: result
        };
      } else {
        return {
          status: 500,
          body: result
        };
      }
    } catch (error) {
      return {
        status: 500,
        body: {
          success: false,
          message: '內部錯誤',
          error: error.message
        }
      };
    }
  },

  // 獲取訂閱狀態端點
  '/api/subscription-status': async () => {
    const subscriptions = window.pushNotificationAPI.getSubscriptions();
    return {
      status: 200,
      body: {
        activeSubscriptions: subscriptions.length,
        subscriptions: subscriptions
      }
    };
  }
};

// 攔截 fetch 請求以模擬 API
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  // 檢查是否為我們的模擬 API
  if (url.startsWith('/api/')) {
    const apiPath = url;
    
    if (window.mockAPI[apiPath]) {
      let requestData = {};
      
      if (options.body) {
        try {
          requestData = JSON.parse(options.body);
        } catch (e) {
          requestData = {};
        }
      }
      
      const result = await window.mockAPI[apiPath](requestData);
      
      // 返回模擬的 Response 物件
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
  // 對於其他請求，使用原始的 fetch
  return originalFetch(url, options);
};

// PWA 安裝提示
class PWAInstallPrompt {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.init();
  }

  init() {
    // 監聽 beforeinstallprompt 事件
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // 檢查是否已安裝
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('應用程式已安裝為 PWA');
      this.hideInstallButton();
    }
  }

  showInstallButton() {
    if (!this.installButton) {
      this.createInstallButton();
    }
    this.installButton.style.display = 'block';
  }

  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
  }

  createInstallButton() {
    this.installButton = document.createElement('button');
    this.installButton.textContent = '安裝應用程式';
    this.installButton.className = 'pwa-install-btn';
    this.installButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-cyan);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,170,255,0.3);
      transition: all 0.2s ease;
    `;

    this.installButton.addEventListener('click', () => {
      this.installApp();
    });

    document.body.appendChild(this.installButton);
  }

  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('用戶接受了安裝提示');
        this.hideInstallButton();
      } else {
        console.log('用戶拒絕了安裝提示');
      }
      
      this.deferredPrompt = null;
    }
  }
}

// 初始化 PWA 安裝提示
document.addEventListener('DOMContentLoaded', () => {
  new PWAInstallPrompt();
});

console.log('PWA 配置和推送通知模擬 API 已載入');
