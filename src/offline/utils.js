/* global localforage */

const storageKey = 'offline-collections';

export function getOfflineList() {
  return localforage.getItem(storageKey)
    .then(list => list || []);
}

export function setOfflineList(list) {
  return localforage.setItem(storageKey, list);
}

export function saveToOfflineList(collection) {
  return (
    getOfflineList()
      .then(collections =>
        collections.concat({
          uuid: collection.uuid,
          slug: collection.slug,
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
