// Service Worker for 100% Offline Progressive Web App (PWA)
const CACHE_NAME = 'fitness-app-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './5769576165000548428.jpg',
  './5769576165000548429.jpg',
  './5769576165000548430.jpg',
  './5769576165000548431.jpg',
  './5769576165000548432.jpg',
  './5769576165000548433.jpg',
  './5769576165000548434.jpg',
  './5769576165000548435.jpg',
  './5769576165000548436.jpg',
  './5769576165000548437.jpg',
  './5769576165000548438.jpg',
  './5769576165000548439.jpg',
  './5769576165000548441.jpg',
  './5769576165000548442.jpg',
  './5769576165000548443.jpg',
  './5769576165000548444.jpg',
  './5769576165000548445.jpg',
  './5769576165000548446.jpg',
  './5769576165000548447.jpg',
  './5769576165000548448.jpg',
  './5769576165000548449.jpg',
  './5769576165000548450.jpg',
  './5769576165000548451.jpg',
  './5769576165000548452.jpg',
  './5769576165000548453.jpg',
  './5769576165000548454.jpg',
  './5769576165000548455.jpg',
  './5769576165000548456.jpg',
  './5769576165000548457.jpg',
  './5769576165000548458.jpg',
  './5769576165000548459.jpg',
  './5769576165000548460.jpg',
  './5769576165000548461.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching offline assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic gets if valid
        if (event.request.method === 'GET' && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return caches.match('./index.html');
      });
    })
  );
});
