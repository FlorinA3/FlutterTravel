const CACHE_NAME = 'ble-controller-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/device.svg',
  '/icons/play.svg',
  '/icons/pause.svg',
  '/icons/stop.svg'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('[ServiceWorker] Found in cache', event.request.url);
          return response;
        }

        console.log('[ServiceWorker] Fetching from network', event.request.url);
        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline - content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'text/plain'
            }
          });
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions when back online
      handleBackgroundSync()
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

async function handleBackgroundSync() {
  try {
    // Handle any pending offline actions here
    console.log('[ServiceWorker] Handling background sync');
  } catch (error) {
    console.error('[ServiceWorker] Background sync failed', error);
  }
}

// Push notification handling (for future enhancement)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  const title = 'BLE Controller';
  const options = {
    body: event.data ? event.data.text() : 'Default notification',
    icon: '/icons/device.svg',
    badge: '/icons/device.svg'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
