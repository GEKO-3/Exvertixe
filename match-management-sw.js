const CACHE_NAME = 'fmsc-match-management-v3';
const urlsToCache = [
  './match-management.html?pwa=true',
  './match-management.html',
  './match-management-manifest.json',
  './Tounament logo.svg',
  './icon-192x192.png',
  // Add other assets specific to match management
  'https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap',
  'https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap',
  'https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.4.0/firebase-database-compat.js'
];

self.addEventListener('install', function(event) {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Match Management: Opened cache v2');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // For HTML files, always try network first to get latest version
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // If network succeeds, update cache and return response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(function() {
          // If network fails, fall back to cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other resources, cache first
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});

self.addEventListener('activate', function(event) {
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME && (
                cacheName.startsWith('fmsc-match-management-') || 
                cacheName.startsWith('fmsc-') ||
                cacheName.includes('match-management')
              )) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ])
  );
});

// Listen for messages from the main thread
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName.startsWith('fmsc-match-management-')) {
              console.log('Manually clearing cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }).then(function() {
        // Reload the page after clearing cache
        self.clients.matchAll().then(function(clients) {
          clients.forEach(function(client) {
            client.postMessage({type: 'CACHE_CLEARED'});
          });
        });
      })
    );
  }
});