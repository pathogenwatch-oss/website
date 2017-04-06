const assetCache = 'wgsa-offline-cache';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => self.clients.claim());

const cachePatterns = [
  /^https?:\/\/.+\.(js|css|png|jpg|jpeg|gif|svg|woff2)$/,
  /^https?:\/\/fonts\.googleapis\.com/,
  /^https?:\/\/api\.mapbox\.com/,
];
//
function shouldCache(request) {
  return (
    request.method === 'GET' &&
    cachePatterns.some(pattern => pattern.test(request.url))
  );
}

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(assetCache).then(cache =>
        fetch(event.request)
          .then(response => {
            cache.put('/index.html', response.clone()); // update on every navigation
            return response;
          })
          .catch(() => cache.match('/index.html')) // enables offline mode
      )
    );
    return;
  }

  if (shouldCache(event.request)) {
    event.respondWith(
      caches.open(assetCache).then(cache =>
        fetch(event.request).then(response => {
          cache.put(event.request, response.clone()); // update on every navigation
          return response;
        })
        .catch(() => cache.match(event.request)) // enables offline mode
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request) // network-first
      .catch(() => caches.match(event.request)) // fallback to cache
  );
});
