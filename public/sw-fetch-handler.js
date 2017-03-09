// https://una.im/save-offline/

self.addEventListener('fetch', event => {
  // Get current path
  const requestUrl = new URL(event.request.url);

  // Save all resources on origin path only
  // if (requestUrl.origin === location.origin) {
  if (requestUrl.pathname.indexOf('/api') === 0) {
    event.respondWith(
      caches.match(event.request).
        then(response => response || fetch(event.request))
    );
  }
  // }
});
