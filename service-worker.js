// Root Service Worker - controls scope '/'
const CACHE_NAME = 'obyssey-root-v1';
const urlsToCache = [
  '/',
  '/meditation.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // 僅處理 GET，且忽略 Range/音訊/跨來源
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return; // 讓瀏覽器原生處理分段請求
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.destination === 'audio' || req.destination === 'video') return; // 媒體交給瀏覽器

  // 僅攔截導覽與少數核心資源，採用網路優先、失敗退回快取
  const corePaths = new Set(['/','/meditation.html','/manifest.json','/favicon.ico','/icons/icon-192x192.png','/icons/icon-512x512.png']);
  if (req.mode === 'navigate' || corePaths.has(url.pathname)) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
  }
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '冥想提醒';
  const body = data.body || '該是冥想的時候了！';
  const options = {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'meditation-reminder',
    data: { url: '/meditation.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(clients.openWindow(url));
});
