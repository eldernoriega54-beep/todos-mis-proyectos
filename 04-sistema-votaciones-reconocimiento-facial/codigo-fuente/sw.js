const CACHE_NAME = 'votaciones-pwa-v3';
const urlsToCache = [
  '/chevez/index.html',
  '/chevez/registro.html',
  '/chevez/admin.html',
  '/chevez/js/face-login.js',
  '/chevez/js/face-register.js',
  '/chevez/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Forza a que instale instantaneo
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return from cache
        }
        return fetch(event.request).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // Toma control rapido
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
