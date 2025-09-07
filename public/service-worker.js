// Service Worker for Meditation Music Player
const CACHE_NAME = 'meditation-music-v2';
// 僅列出確定存在的檔案，避免因快取目錄或 404 導致安裝失敗
const urlsToCache = [
  '/',
  '/meditation.html',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        await cache.addAll(urlsToCache);
      } catch (e) {
        // 忽略個別檔案快取失敗，避免整體安裝失敗
        console.warn('Cache addAll error:', e);
      }
      // 立即接管
      await self.skipWaiting();
    })()
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // 僅處理 GET；忽略 Range/媒體/跨來源，避免音訊被截斷或錯誤快取
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return; // 讓瀏覽器直接處理分段請求
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.destination === 'audio' || req.destination === 'video') return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const resp = await fetch(req);
        // 僅快取完整 200 回應，避免將 206 Partial Content 放入快取
        if (resp && resp.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, resp.clone());
        }
        return resp;
      } catch (e) {
        return cached || new Response('Offline', { status: 503 });
      }
    })()
  );
});

// Push event - handle meditation reminders
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: '冥想提醒',
    body: '該是冥想的時候了！讓我們一起靜心，感受內在的寧靜。',
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
  };

  // Parse custom data if available
  if (event.data) {
    try {
      const customData = event.data.json();
      if (customData.title) notificationData.title = customData.title;
      if (customData.body) notificationData.body = customData.body;
      if (customData.icon) notificationData.icon = customData.icon;
    } catch (e) {
      console.log('Using default notification data');
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    // Open the meditation app
    event.waitUntil(
      clients.openWindow('/meditation.html')
    );
  } else if (event.action === 'snooze') {
    // Snooze for 10 minutes
    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(() => {
          self.registration.showNotification('冥想提醒', {
            body: '10分鐘後再次提醒您進行冥想',
            icon: './favicon.ico',
            tag: 'meditation-reminder'
          });
          resolve();
        }, 600000); // 10 minutes
      })
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/meditation.html')
    );
  }
});

// 於 activate 階段清理舊版快取並接管控制
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Background sync for offline reminders
self.addEventListener('sync', (event) => {
  if (event.tag === 'meditation-reminder') {
    event.waitUntil(
      // Send reminder notification
      self.registration.showNotification('冥想提醒', {
        body: '該是冥想的時候了！',
        icon: './favicon.ico',
        tag: 'meditation-reminder',
        requireInteraction: true
      })
    );
  }
});

// Handle app installation
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('App installation prompt available');
  // Store the event for later use
  event.preventDefault();
  return false;
});
