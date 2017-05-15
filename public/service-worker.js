const assetCache = 'wgsa-offline-cache';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => self.clients.claim());

const nonNavigationPaths = /^\/(api|download)\//;

function isNavigation(event) {
  const url = new URL(event.request.url);
  return (
    event.request.mode === 'navigate' &&
    nonNavigationPaths.test(url.pathname) === false
  );
}

const cachePatterns = [
  /^https?:\/\/.+\.(js|css|png|jpg|jpeg|gif|svg|woff2)$/,
  /^https?:\/\/fonts\.googleapis\.com/,
  /^https?:\/\/api\.mapbox\.com/,
];

function shouldCache(request) {
  return (
    request.method === 'GET' &&
    cachePatterns.some(pattern => pattern.test(request.url))
  );
}

const fallbackPaths = /^\/api\/collection\//;

function shouldFallback(request) {
  const url = new URL(request.url);
  return (
    request.method === 'GET' &&
    (url.hostname === 'localhost' || url.origin === location.origin) &&
    fallbackPaths.test(url.pathname)
  );
}

self.addEventListener('fetch', event => {
  // Navigation caching
  if (isNavigation(event)) {
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

  // Asset caching
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

  // API caching
  if (shouldFallback(event.request)) {
    event.respondWith(
      fetch(event.request) // network-first
        .then(response =>
          (response.status === 200 ?
            response :
            caches.match(event.request)) // online fallback
        )
        .catch(() => caches.match(event.request)) // offline fallback
    );
  }
});
