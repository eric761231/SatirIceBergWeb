// Service Worker for Meditation Music Player
const CACHE_NAME = 'meditation-music-v1';
const urlsToCache = [
  '/',
  '/music.html',
  '/meditationMusic/',
  '/images/',
  '/ice-icon.svg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event - handle meditation reminders
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: '冥想提醒',
    body: '該是冥想的時候了！讓我們一起靜心，感受內在的寧靜。',
    icon: '/ice-icon.svg',
    badge: '/ice-icon.svg',
    tag: 'meditation-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: '開始冥想',
        icon: '/ice-icon.svg'
      },
      {
        action: 'snooze',
        title: '稍後提醒',
        icon: '/ice-icon.svg'
      }
    ],
    data: {
      url: '/music.html',
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
      clients.openWindow('/music.html')
    );
  } else if (event.action === 'snooze') {
    // Snooze for 10 minutes
    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(() => {
          self.registration.showNotification('冥想提醒', {
            body: '10分鐘後再次提醒您進行冥想',
            icon: '/ice-icon.svg',
            tag: 'meditation-reminder'
          });
          resolve();
        }, 600000); // 10 minutes
      })
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/music.html')
    );
  }
});

// Background sync for offline reminders
self.addEventListener('sync', (event) => {
  if (event.tag === 'meditation-reminder') {
    event.waitUntil(
      // Send reminder notification
      self.registration.showNotification('冥想提醒', {
        body: '該是冥想的時候了！',
        icon: '/ice-icon.svg',
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
