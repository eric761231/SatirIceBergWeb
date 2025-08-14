// Obyssey PWA Service Worker
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  // 可在此清理舊快取
});
self.addEventListener('fetch', event => {
  // 預設直接走網路
});
