// https://una.im/save-offline/

const isApiCall = /^\/api/;

function shouldRespondTo(event) {
  const requestUrl = new URL(event.request.url);
  return (
    requestUrl.origin === location.origin && (
      isApiCall.test(requestUrl.pathname) ||
      event.request.mode === 'navigate'
    )
  );
}

self.addEventListener('fetch', event => {
  console.log(event.request.url);
  if (shouldRespondTo(event)) {
    event.respondWith(
      caches.match(event.request).
        then(response => response || fetch(event.request), { credentials: 'same-origin' })
    );
  }
});
