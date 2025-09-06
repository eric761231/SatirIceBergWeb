// Service Worker for Obyssey PWA
const CACHE_NAME = 'obyssey-v1.0.3';
const STATIC_CACHE = 'obyssey-static-v1.0.3';
const DYNAMIC_CACHE = 'obyssey-dynamic-v1.0.3';

const STATIC_FILES = [
    '/',
    '/meditation.html',
    '/index.html',
    '/ice.html',
    '/notification-test.html',
    '/pwa-cache-clear.html',
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
    '/icons/icon-512x512.png',
    '/images/rainbow.png',
    '/images/HamSa.png',
    '/images/mindfulness.png',
    '/images/warroirscreed.png',
    '/images/hollow.png',
    '/images/pearOcean.png'
];

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker 安裝中...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 開始快取檔案...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker 安裝完成');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker 安裝失敗:', error);
                // 即使快取失敗，也要繼續安裝
                return self.skipWaiting();
            })
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
      .then(() => {
        // 通知所有客戶端 Service Worker 已準備就緒
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_READY'
            });
          });
        });
        
        // 恢復提醒檢查
        loadReminderSettings().then(settings => {
          if (settings && settings.enabled) {
            console.log('恢復提醒設定:', settings);
            startReminderCheck();
          }
        });
      })
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
  
  // 檢查提醒（每分鐘一次）
  const now = Date.now();
  if (now - lastReminderCheck > 60000) {
    lastReminderCheck = now;
    checkReminders();
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

// 改進的背景提醒功能
let reminderCheckInterval = null;
let lastReminderCheck = 0;

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
  console.log('背景同步事件:', event.tag);
  
  if (event.tag === 'meditation-reminder') {
    event.waitUntil(
      checkReminders().catch(error => {
        console.error('背景同步檢查失敗:', error);
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
    saveReminderSettings(reminderData);
    
    // 立即開始檢查提醒
    startReminderCheck();
  } else if (event.data.type === 'CLEAR_REMINDER') {
    console.log('清除提醒設定');
    clearReminderCheck();
  }
});

// 啟動提醒檢查
function startReminderCheck() {
  // 清除現有的檢查
  if (reminderCheckInterval) {
    clearInterval(reminderCheckInterval);
  }
  
  // 立即檢查一次
  checkReminders();
  
  // 設定定期檢查（每30秒檢查一次）
  reminderCheckInterval = setInterval(() => {
    checkReminders();
  }, 30000);
  
  console.log('提醒檢查已啟動');
}

// 清除提醒檢查
function clearReminderCheck() {
  if (reminderCheckInterval) {
    clearInterval(reminderCheckInterval);
    reminderCheckInterval = null;
  }
  console.log('提醒檢查已清除');
}

// 改進的提醒檢查函數
async function checkReminders() {
  try {
    const reminderSettings = await loadReminderSettings();
    if (!reminderSettings || !reminderSettings.enabled) {
      return;
    }
    
    const now = new Date();
    const [targetHour, targetMinute] = reminderSettings.time.split(':').map(Number);
    const currentDay = now.getDay();
    
    // 檢查頻率設定
    let shouldRemind = false;
    if (reminderSettings.frequency === 'daily') {
      shouldRemind = true;
    } else if (reminderSettings.frequency === 'weekdays') {
      if (currentDay >= 1 && currentDay <= 5) {
        shouldRemind = true;
      }
    } else if (reminderSettings.frequency === 'custom') {
      if (reminderSettings.customDays && reminderSettings.customDays.includes(currentDay)) {
        shouldRemind = true;
      }
    }
    
    // 檢查時間是否匹配
    if (shouldRemind && 
        now.getHours() === targetHour && 
        now.getMinutes() === targetMinute) {
      
      // 檢查是否已經在這一分鐘內發送過通知
      const lastNotificationKey = `last-notification-${targetHour}-${targetMinute}-${currentDay}`;
      const lastNotificationTime = await getLastNotificationTime(lastNotificationKey);
      const currentMinute = now.getTime() - (now.getTime() % 60000);
      
      if (lastNotificationTime < currentMinute) {
        // 發送通知
        await self.registration.showNotification('冥想提醒', {
          body: reminderSettings.message || '該是冥想的時候了！讓我們一起靜心，感受內在的寧靜。',
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
        });
        
        // 記錄發送時間
        await setLastNotificationTime(lastNotificationKey, currentMinute);
        console.log('冥想提醒已發送:', {
          time: reminderSettings.time,
          message: reminderSettings.message,
          frequency: reminderSettings.frequency
        });
      }
    }
  } catch (error) {
    console.error('檢查提醒失敗:', error);
  }
}

// 改進的儲存提醒設定
async function saveReminderSettings(reminderData) {
  try {
    const cache = await caches.open('reminder-settings');
    const response = new Response(JSON.stringify(reminderData));
    await cache.put('/reminder-settings', response);
    console.log('提醒設定已儲存:', reminderData);
  } catch (error) {
    console.error('儲存提醒設定失敗:', error);
  }
}

// 改進的讀取提醒設定
async function loadReminderSettings() {
  try {
    const cache = await caches.open('reminder-settings');
    const response = await cache.match('/reminder-settings');
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('讀取提醒設定失敗:', error);
  }
  return null;
}

// 清除提醒設定
async function clearReminderSettings() {
  try {
    const cache = await caches.open('reminder-settings');
    await cache.delete('/reminder-settings');
    console.log('提醒設定已清除');
  } catch (error) {
    console.error('清除提醒設定失敗:', error);
  }
}

// 改進的儲存最後通知時間
async function setLastNotificationTime(key, time) {
  try {
    const cache = await caches.open('notification-times');
    const response = new Response(time.toString());
    await cache.put(`/${key}`, response);
  } catch (error) {
    console.error('儲存通知時間失敗:', error);
  }
}

// 改進的讀取最後通知時間
async function getLastNotificationTime(key) {
  try {
    const cache = await caches.open('notification-times');
    const response = await cache.match(`/${key}`);
    if (response) {
      const time = await response.text();
      return parseInt(time) || 0;
    }
  } catch (error) {
    console.error('讀取通知時間失敗:', error);
  }
  return 0;
}
