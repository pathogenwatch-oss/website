/* global localforage */

const storageKey = 'offline-collections';

export function getOfflineList() {
  return localforage.getItem(storageKey)
    .then(list => list || [])
    .then(list =>
      list.map(collection => ({
        ...collection,
        token: collection.token || collection.slug,
      }))
    );
}

export function setOfflineList(list) {
  return localforage.setItem(storageKey, list);
}

export function saveToOfflineList(collection) {
  return (
    getOfflineList()
      .then(collections =>
        collections.concat({
          token: collection.token,
          size: collection.size,
          title: collection.title,
          description: collection.description,
          createdAt: collection.createdAt,
          organismId: collection.organismId,
        })
      )
      .then(setOfflineList)
  );
}

export function isSupported() {
  return ('caches' in window && 'serviceWorker' in navigator);
}

export function isOffline() {
  return !navigator.onLine;
}

export function createCacheKey(token) {
  return `wgsa-collection-${token}`;
}

export function removeItem(token) {
  return Promise.all([
    getOfflineList()
      .then(collections => collections.filter(_ => _.token !== token))
      .then(setOfflineList),
    caches.delete(createCacheKey(token)),
  ]);
}
