// 簡化的 Service Worker 用於背景提醒測試
const CACHE_NAME = 'simple-reminder-v1.0';

// 安裝事件
self.addEventListener('install', (event) => {
  console.log('Service Worker 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('快取已開啟');
        return cache.addAll([
          '/',
          '/simple-reminder-test.html',
          '/favicon.ico'
        ]);
      })
      .then(() => {
        console.log('Service Worker 安裝完成');
        return self.skipWaiting();
      })
  );
});

// 啟動事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker 啟動中...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('刪除舊快取:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker 啟動完成');
        return self.clients.claim();
      })
  );
});

// 處理 fetch 事件
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只處理 GET 請求
  if (request.method !== 'GET') return;
  
  // 只處理同源請求
  if (url.origin !== location.origin) return;
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // 如果有快取回應，返回快取
        if (response) {
          return response;
        }
        
        // 否則從網路獲取
        return fetch(request)
          .then((networkResponse) => {
            // 如果網路請求成功，快取回應
            if (networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // 網路失敗時返回預設頁面
            if (request.destination === 'document') {
              return caches.match('/simple-reminder-test.html');
            }
            return new Response('網路錯誤', { status: 503 });
          });
      })
  );
});

// 處理推送通知
self.addEventListener('push', (event) => {
  console.log('收到推送事件:', event);
  
  let notificationData = {
    title: '冥想提醒',
    body: '該是冥想的時候了！',
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
      url: '/simple-reminder-test.html',
      timestamp: Date.now()
    }
  };
  
  // 如果有自定義數據，使用自定義數據
  if (event.data) {
    try {
      const customData = event.data.json();
      if (customData.title) notificationData.title = customData.title;
      if (customData.body) notificationData.body = customData.body;
    } catch (e) {
      console.log('使用預設通知數據');
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// 處理通知點擊
self.addEventListener('notificationclick', (event) => {
  console.log('通知被點擊:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    // 開啟應用
    event.waitUntil(
      clients.openWindow('/simple-reminder-test.html')
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
      clients.openWindow('/simple-reminder-test.html')
    );
  }
});

// 處理背景同步
self.addEventListener('sync', (event) => {
  console.log('背景同步事件:', event.tag);
  
  if (event.tag === 'meditation-reminder') {
    event.waitUntil(
      checkReminders()
    );
  }
});

// 處理來自主線程的訊息
self.addEventListener('message', (event) => {
  console.log('收到訊息:', event.data);
  
  if (event.data.type === 'SET_REMINDER') {
    const reminderData = event.data.data;
    console.log('設定提醒:', reminderData);
    
    // 儲存提醒設定
    saveReminderSettings(reminderData);
    
    // 立即檢查一次
    checkReminders();
  } else if (event.data.type === 'CLEAR_REMINDER') {
    console.log('清除提醒設定');
    clearReminderSettings();
  } else if (event.data.type === 'CHECK_REMINDERS') {
    console.log('強制檢查提醒');
    checkReminders();
  }
});

// 儲存提醒設定
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

// 讀取提醒設定
async function loadReminderSettings() {
  try {
    const cache = await caches.open('reminder-settings');
    const response = await cache.match('/reminder-settings');
    if (response) {
      const data = await response.json();
      console.log('讀取提醒設定:', data);
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

// 檢查提醒
async function checkReminders() {
  try {
    console.log('開始檢查提醒...');
    
    // 讀取儲存的提醒設定
    const reminderSettings = await loadReminderSettings();
    if (!reminderSettings) {
      console.log('沒有找到提醒設定');
      return;
    }
    
    const now = new Date();
    const [targetHour, targetMinute] = reminderSettings.time.split(':').map(Number);
    const currentDay = now.getDay();
    
    console.log('當前時間:', now.toLocaleString());
    console.log('目標時間:', `${targetHour}:${targetMinute}`);
    console.log('當前小時:', now.getHours(), '目標小時:', targetHour);
    console.log('當前分鐘:', now.getMinutes(), '目標分鐘:', targetMinute);
    
    let shouldRemind = false;
    if (reminderSettings.frequency === 'daily') {
      shouldRemind = true;
    } else if (reminderSettings.frequency === 'weekdays') {
      if (currentDay >= 1 && currentDay <= 5) {
        shouldRemind = true;
      }
    } else if (reminderSettings.frequency === 'custom') {
      if (reminderSettings.customDays.includes(currentDay)) {
        shouldRemind = true;
      }
    }
    
    // 檢查是否已經在這一分鐘內發送過通知
    const lastNotificationKey = `last-notification-${targetHour}-${targetMinute}-${currentDay}`;
    const lastNotificationTime = await getLastNotificationTime(lastNotificationKey);
    const currentMinute = now.getTime() - (now.getTime() % 60000); // 當前分鐘的開始時間
    
    console.log('應該提醒:', shouldRemind);
    console.log('時間匹配:', now.getHours() === targetHour && now.getMinutes() === targetMinute);
    console.log('上次通知時間:', lastNotificationTime, '當前分鐘:', currentMinute);
    
    if (shouldRemind && 
        now.getHours() === targetHour && 
        now.getMinutes() === targetMinute && 
        lastNotificationTime < currentMinute) {
      
      console.log('發送提醒通知...');
      
      // 發送通知
      await self.registration.showNotification('冥想提醒', {
        body: reminderSettings.message || '該是冥想的時候了！',
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
          url: '/simple-reminder-test.html',
          timestamp: Date.now()
        }
      });
      
      // 記錄發送時間
      await setLastNotificationTime(lastNotificationKey, currentMinute);
      console.log('冥想提醒已發送');
    } else {
      console.log('不需要發送提醒');
    }
  } catch (error) {
    console.error('檢查提醒失敗:', error);
  }
}

// 儲存最後通知時間
async function setLastNotificationTime(key, time) {
  try {
    const cache = await caches.open('notification-times');
    const response = new Response(time.toString());
    await cache.put(`/${key}`, response);
    console.log('通知時間已儲存:', key, time);
  } catch (error) {
    console.error('儲存通知時間失敗:', error);
  }
}

// 讀取最後通知時間
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

console.log('Service Worker 腳本已載入');

