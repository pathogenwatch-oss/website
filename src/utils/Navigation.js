export function hashChangeFallback() {
  // exit if the browser implements that event
  if ( "onhashchange" in window.document.body ) { return; }

  var location = window.location,
    oldURL = location.href,
    oldHash = location.hash;

  // check the location hash on a 100ms interval
  setInterval(function() {
    var newURL = location.href,
      newHash = location.hash;

    // if the hash has changed and a handler has been bound...
    if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
      // execute the handler
      window.onhashchange({
        type: "hashchange",
        oldURL: oldURL,
        newURL: newURL
      });

      oldURL = newURL;
      oldHash = newHash;
    }
  }, 100);
}

export function navigateToAssembly(name) {
  if (window.location.pathname !== '/saureus/upload') {
    return console.error('Invalid location path', window.location);
  }
  return navigateTo('assembly', name);
}

function navigateTo(prefix, id) {
  const hash = `#${prefix}-${id}`;
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}
