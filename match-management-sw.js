const CACHE_NAME = 'fmsc-match-management-v1';
const urlsToCache = [
  './match-management.html',
  './Tounament logo.svg',
  './icon-192x192.png',
  // Add other assets specific to match management
  'https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap',
  'https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap',
  'https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.4.0/firebase-database-compat.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Match Management: Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('fmsc-match-management-')) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});