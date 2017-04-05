importScripts('https://raw.githubusercontent.com/GoogleChrome/sw-toolbox/master/sw-toolbox.js');

const cacheName = 'wgsa-asset-cache';
toolbox.options.cache.name = 'wgsa-runtime-cache';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => self.clients.claim());

toolbox.router.get(/^https?:\/\/.+\.(js|css|png|jpg|jpeg|gif|svg|woff2)$/, toolbox.networkFirst, {});
toolbox.router.get(/^https?:\/\/fonts\.googleapis\.com/, toolbox.networkFirst, {});
toolbox.router.get(/^https?:\/\/api\.mapbox\.com/, toolbox.networkFirst, {});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(cacheName).then(cache =>
        fetch(event.request).then(response => {
          cache.put('/index.html', response.clone()); // update on every navigation
          return response;
        })
        .catch(() => cache.match('/index.html')) // enables offline mode
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request) // network-first
      .catch(() => caches.match(event.request)) // fallback to cache
  );
});
