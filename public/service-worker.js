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
  // 僅處理 GET 請求
  if (event.request.method !== 'GET') return;
  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      try {
        const resp = await fetch(event.request);
        // 將成功的回應放入快取（僅同源）
        if (resp && resp.ok && new URL(event.request.url).origin === location.origin) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, resp.clone());
        }
        return resp;
      } catch (e) {
        // 網路失敗時回退快取（若有）
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
