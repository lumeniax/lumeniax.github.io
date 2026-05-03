const CACHE_NAME = 'lumeniax-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.svg'
];

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

function isArticleDataRequest(request) {
  const { pathname } = new URL(request.url);
  return pathname === '/articles/articles.json' || pathname.startsWith('/articles/content/');
}

function isArticlePageRequest(request) {
  const { pathname } = new URL(request.url);
  return pathname.startsWith('/academy/articles/');
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response && response.status === 200 && isSameOrigin(request)) {
    const responseToCache = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, responseToCache);
    });
  }
  return response;
}

async function networkFirst(request, { fallbackToIndex = false, cacheResponse = true } = {}) {
  try {
    const response = await fetch(request);
    if (cacheResponse && response && response.status === 200 && isSameOrigin(request)) {
      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache);
      });
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    if (fallbackToIndex) {
      return caches.match('/index.html');
    }

    throw new Error('Network unavailable');
  }
}

// Install event - caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  if (isArticleDataRequest(event.request)) {
    event.respondWith(
      networkFirst(event.request, { cacheResponse: false }),
    );
    return;
  }

  if (event.request.mode === 'navigate' || isArticlePageRequest(event.request)) {
    event.respondWith(
      networkFirst(event.request, { fallbackToIndex: true }),
    );
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Lumeniax', body: 'Nouvelle mise à jour disponible !' };
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/favicon.svg',
    data: {
      url: data.url || '/'
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
