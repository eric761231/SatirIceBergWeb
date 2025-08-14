// Service Worker for Obyssey PWA
const CACHE_NAME = 'obyssey-v1.0.0';
const STATIC_CACHE = 'obyssey-static-v1.0.0';
const DYNAMIC_CACHE = 'obyssey-dynamic-v1.0.0';

// 需要緩存的核心文件
const STATIC_FILES = [
    '/',
    '/index.html',
    '/ice.html',
    '/install-app.html',
    '/pwa-config.js',
    '/manifest.json',
    '/sw.js',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// 安裝事件 - 緩存核心文件
self.addEventListener('install', (event) => {
    console.log('Service Worker 安裝中...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('緩存核心文件...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('核心文件緩存完成');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('緩存核心文件失敗:', error);
            })
    );
});

// 激活事件 - 清理舊緩存
self.addEventListener('activate', (event) => {
    console.log('Service Worker 激活中...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('刪除舊緩存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker 激活完成');
                return self.clients.claim();
            })
    );
});

// 攔截網絡請求
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 跳過非 GET 請求
    if (request.method !== 'GET') {
        return;
    }
    
    // 跳過非 HTTP/HTTPS 請求
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // 跳過 Chrome 擴展請求
    if (url.origin === 'chrome-extension://') {
        return;
    }
    
    // 處理不同類型的請求
    if (isStaticFile(request.url)) {
        // 靜態文件使用 Cache First 策略
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isAPIRequest(request.url)) {
        // API 請求使用 Network First 策略
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        // 其他請求使用 Stale While Revalidate 策略
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
});

// 判斷是否為靜態文件
function isStaticFile(url) {
    return STATIC_FILES.some(file => url.includes(file)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.jpeg') ||
           url.includes('.gif') ||
           url.includes('.svg') ||
           url.includes('.woff') ||
           url.includes('.woff2') ||
           url.includes('.ttf') ||
           url.includes('.eot');
}

// 判斷是否為 API 請求
function isAPIRequest(url) {
    return url.includes('/api/') ||
           url.includes('gemini') ||
           url.includes('openai') ||
           url.includes('anthropic');
}

// Cache First 策略 - 優先使用緩存
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache First 策略失敗:', error);
        return new Response('網絡錯誤', { status: 503 });
    }
}

// Network First 策略 - 優先使用網絡
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('網絡請求失敗，嘗試使用緩存:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('離線且無緩存', { status: 503 });
    }
}

// Stale While Revalidate 策略 - 同時返回緩存和更新
async function staleWhileRevalidate(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        const fetchPromise = fetch(request).then(async (networkResponse) => {
            if (networkResponse.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        }).catch(() => {
            console.log('網絡請求失敗，保持緩存不變');
        });
        
        return cachedResponse || fetchPromise;
    } catch (error) {
        console.error('Stale While Revalidate 策略失敗:', error);
        return new Response('策略執行失敗', { status: 503 });
    }
}

// 處理推送通知
self.addEventListener('push', (event) => {
    console.log('收到推送通知:', event);
    
    const options = {
        body: 'Obyssey 有新消息',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '查看',
                icon: '/icons/icon-72x72.png'
            },
            {
                action: 'close',
                title: '關閉',
                icon: '/icons/icon-72x72.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Obyssey', options)
    );
});

// 處理通知點擊
self.addEventListener('notificationclick', (event) => {
    console.log('通知被點擊:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// 處理後台同步
self.addEventListener('sync', (event) => {
    console.log('後台同步事件:', event);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 執行後台同步
async function doBackgroundSync() {
    try {
        console.log('執行後台同步...');
        // 這裡可以實現離線時的數據同步邏輯
        return Promise.resolve();
    } catch (error) {
        console.error('後台同步失敗:', error);
        return Promise.reject(error);
    }
}

// 處理消息
self.addEventListener('message', (event) => {
    console.log('收到消息:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 錯誤處理
self.addEventListener('error', (event) => {
    console.error('Service Worker 錯誤:', event.error);
});

// 未處理的 Promise 拒絕
self.addEventListener('unhandledrejection', (event) => {
    console.error('未處理的 Promise 拒絕:', event.reason);
});
