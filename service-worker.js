// Service Worker for Obyssey PWA
const CACHE_NAME = 'obyssey-v1.0.1';
const STATIC_CACHE = 'obyssey-static-v1.0.1';
const DYNAMIC_CACHE = 'obyssey-dynamic-v1.0.1';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/ice.html',
    '/meditation.html',
    '/notification-test.html',
    '/public/install-app.html',
    '/public/pwa-config.js',
    '/manifest.json',
    '/sw.js',
    '/service-worker.js',
    '/favicon.ico',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(STATIC_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;
    if (url.origin === 'chrome-extension://') return;
    if (isStaticFile(request.url)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isAPIRequest(request.url)) {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
});

function isStaticFile(url) {
    return STATIC_FILES.some(file => url.includes(file)) ||
           url.includes('.css') || url.includes('.js') || url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.svg') || url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf') || url.includes('.eot');
}
function isAPIRequest(url) {
    return url.includes('/api/') || url.includes('gemini') || url.includes('openai') || url.includes('anthropic');
}
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('網絡錯誤', { status: 503 });
    }
}
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        return new Response('離線且無緩存', { status: 503 });
    }
}
async function staleWhileRevalidate(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        const fetchPromise = fetch(request).then(async (networkResponse) => {
            if (networkResponse.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        }).catch(() => {});
        return cachedResponse || fetchPromise;
    } catch (error) {
        return new Response('策略執行失敗', { status: 503 });
    }
}

// 推送通知處理
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: '冥想提醒',
    body: '該是冥想的時候了！讓我們一起靜心，感受內在的寧靜。',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'meditation-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: '開始冥想',
        icon: '/favicon.ico'
      },
      {
        action: 'snooze',
        title: '稍後提醒',
        icon: '/favicon.ico'
      }
    ],
    data: {
      url: '/meditation.html',
      timestamp: Date.now()
    }
  };

  // 解析自定義數據
  if (event.data) {
    try {
      const customData = event.data.json();
      if (customData.title) notificationData.title = customData.title;
      if (customData.body) notificationData.body = customData.body;
      if (customData.icon) notificationData.icon = customData.icon;
    } catch (e) {
      console.log('使用預設通知數據');
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// 通知點擊事件
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    // 開啟冥想應用
    event.waitUntil(
      clients.openWindow('/meditation.html')
    );
  } else if (event.action === 'snooze') {
    // 延遲 10 分鐘
    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(() => {
          self.registration.showNotification('冥想提醒', {
            body: '10分鐘後再次提醒您進行冥想',
            icon: '/favicon.ico',
            tag: 'meditation-reminder'
          });
          resolve();
        }, 600000); // 10 分鐘
      })
    );
  } else {
    // 預設動作 - 開啟應用
    event.waitUntil(
      clients.openWindow('/meditation.html')
    );
  }
});

// 背景同步處理離線提醒
self.addEventListener('sync', (event) => {
  if (event.tag === 'meditation-reminder') {
    event.waitUntil(
      // 發送提醒通知
      self.registration.showNotification('冥想提醒', {
        body: '該是冥想的時候了！',
        icon: './favicon.ico',
        tag: 'meditation-reminder',
        requireInteraction: true
      })
    );
  }
});

// 處理來自主線程的訊息
self.addEventListener('message', (event) => {
  console.log('Service Worker 收到訊息:', event.data);
  
  if (event.data.type === 'SET_REMINDER') {
    const reminderData = event.data.data;
    console.log('設定提醒:', reminderData);
    
    // 儲存提醒設定
    self.reminderSettings = reminderData;
    
    // 設定定時檢查
    if (self.reminderIntervalId) {
      clearInterval(self.reminderIntervalId);
    }
    
    self.reminderIntervalId = setInterval(() => {
      const now = new Date();
      const [targetHour, targetMinute] = reminderData.time.split(':').map(Number);
      const currentDay = now.getDay();
      
      let shouldRemind = false;
      if (reminderData.frequency === 'daily') {
        shouldRemind = true;
      } else if (reminderData.frequency === 'weekdays') {
        if (currentDay >= 1 && currentDay <= 5) {
          shouldRemind = true;
        }
      } else if (reminderData.frequency === 'custom') {
        if (reminderData.customDays.includes(currentDay)) {
          shouldRemind = true;
        }
      }
      
      if (shouldRemind && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        self.registration.showNotification('冥想提醒', {
          body: reminderData.message,
          icon: './favicon.ico',
          badge: './favicon.ico',
          tag: 'meditation-reminder',
          requireInteraction: true,
          actions: [
            {
              action: 'open',
              title: '開始冥想',
              icon: './favicon.ico'
            },
            {
              action: 'snooze',
              title: '稍後提醒',
              icon: './favicon.ico'
            }
          ],
          data: {
            url: './meditation.html',
            timestamp: Date.now()
          }
        });
      }
    }, 60 * 1000); // 每分鐘檢查一次
  }
});
