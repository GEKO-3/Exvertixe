const CACHE_NAME = 'fmsc-control-v9';
const urlsToCache = [
  './index.html',
  './draw-control.html',
  './draw-display.html',
  './schedule-display.html',
  './match-management.html',
  './match-detail.html',
  './team-standings.html',
  './top-scorers.html',
  './card-penalties.html',
  './admin.html',
  './manifest.json',
  './Tounament logo.svg',
  './icon-192x192.png',
  // Team logos (using actual GitHub filenames)
  './Team-Logos/Amigos.jpg',
  './Team-Logos/BEST.jpg',
  './Team-Logos/brave_generation_sports_club.jpg',
  './Team-Logos/FOEMATHI.jpg',
  './Team-Logos/foemathi_jr.jpg',
  './Team-Logos/Goalhians.jpg',
  './Team-Logos/goalhi_sports_club.jpg',
  './Team-Logos/g_star_sports_club.jpg',
  './Team-Logos/kanmathi_fc.jpg',
  './Team-Logos/kanmathi_sc.jpg',
  './Team-Logos/laamu_blues.jpg',
  './Team-Logos/lecrose_sports_club.jpg',
  './Team-Logos/maahinna_united.jpg',
  './Team-Logos/outreef_sports_club.jpg',
  './Team-Logos/youth_academy.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Installing...');
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache).catch((error) => {
          console.log('Service Worker: Some resources failed to cache:', error);
          // Try to cache individual files
          return Promise.allSettled(
            urlsToCache.map(url => cache.add(url).catch(err => {
              console.log(`Failed to cache ${url}:`, err);
            }))
          );
        });
      })
      .catch((error) => {
        console.log('Service Worker: Install failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip caching for Firebase requests to ensure real-time data
  if (event.request.url.includes('firebaseapp.com') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('gstatic.com') ||
      event.request.method !== 'GET') {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If network fails and no cache, return offline page
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating v8...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete, taking control');
      return self.clients.claim();
    })
  );
});

// Handle background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  console.log('Background sync triggered');
  // Here you could implement offline data synchronization
  return Promise.resolve();
}