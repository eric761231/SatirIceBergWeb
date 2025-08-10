// Service Worker for 薩提爾冰山探索者 PWA
const CACHE_NAME = 'satir-iceberg-v1.0.0';
const STATIC_CACHE_NAME = 'satir-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'satir-dynamic-v1.0.0';

// 靜態資源列表
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/ice.html',
  '/healing-config.js',
  '/api-config.json',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap',
  'https://accounts.google.com/gsi/client'
];

// 動態快取的 URL 模式
const CACHE_PATTERNS = [
  /^https:\/\/cdn\.tailwindcss\.com/,
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/accounts\.google\.com/
];

// 安裝事件 - 預快取靜態資源
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: 安裝中...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: 快取靜態資源');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
      })
      .then(() => {
        console.log('✅ Service Worker: 安裝完成');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: 安裝失敗', error);
      })
  );
});

// 啟用事件 - 清理舊快取
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: 啟用中...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: 清理舊快取', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: 啟用完成');
        return self.clients.claim();
      })
  );
});

// 攔截網路請求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 跳過非 GET 請求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳過 Chrome 擴展和其他協議
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // API 請求策略：Network First
  if (url.hostname.includes('generativelanguage.googleapis.com')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // 靜態資源策略：Cache First
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // 頁面請求策略：Network First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflinePage(request));
    return;
  }
  
  // 其他請求策略：Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// 快取策略：Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First 策略失敗:', error);
    return new Response('離線模式：資源暫時無法載入', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// 快取策略：Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// 快取策略：Network First with Offline Page
async function networkFirstWithOfflinePage(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 返回離線頁面
    return caches.match('/index.html');
  }
}

// 快取策略：Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // 背景更新快取
  const networkResponsePromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);
  
  // 返回快取版本或等待網路回應
  return cachedResponse || networkResponsePromise;
}

// 判斷是否為靜態資源
function isStaticAsset(url) {
  return CACHE_PATTERNS.some(pattern => pattern.test(url)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.svg') ||
         url.includes('.woff') ||
         url.includes('.woff2');
}

// 處理推送通知
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || '您有新的訊息',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'satir-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: '查看',
        icon: '/icons/shortcut-chat.png'
      },
      {
        action: 'close',
        title: '關閉',
        icon: '/icons/shortcut-settings.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Skopos', options)
  );
});

// 處理通知點擊
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/ice.html')
    );
  }
});

// 背景同步
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // 這裡可以實現背景數據同步邏輯
  console.log('🔄 執行背景同步');
}

// 錯誤處理
self.addEventListener('error', event => {
  console.error('Service Worker 錯誤:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker 未處理的 Promise 拒絕:', event.reason);
});

console.log('🎯 Service Worker 已載入');
