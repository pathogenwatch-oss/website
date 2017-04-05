importScripts('https://raw.githubusercontent.com/GoogleChrome/sw-toolbox/master/sw-toolbox.js');

// Runtime cache configuration, using the sw-toolbox library.

toolbox.router.get(/^https?:\/\/.+\.(js|css|png|jpg|jpeg|gif|svg|woff2)$/, toolbox.networkFirst, {});
toolbox.router.get(/^https?:\/\/fonts\.googleapis\.com/, toolbox.networkFirst, {});
toolbox.router.get(/^https?:\/\/api\.mapbox\.com/, toolbox.networkFirst, {});


toolbox.precache([ '/index.html', '/images/user.svg' ], {});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request)
    .catch(function () {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      return caches.match(event.request);
    })
  );
});
