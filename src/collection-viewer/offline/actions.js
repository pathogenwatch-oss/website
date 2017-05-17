import { getCollection } from '../selectors';
import { getSubtreeNames } from '../tree/selectors';

import { getServerPath } from '../../utils/Api.js';
import { statuses } from './constants';

import { saveToOfflineList, createCacheKey } from '../../offline/utils';

export const SET_OFFLINE_STATUS = 'SET_OFFLINE_STATUS';

function setStatus(status) {
  return {
    type: SET_OFFLINE_STATUS,
    payload: {
      status,
    },
  };
}

export function checkStatus() {
  return (dispatch, getState) => {
    const state = getState();
    const { uuid } = getCollection(state);

    dispatch(setStatus(statuses.SAVING));
    return (
      Promise.all([
        navigator.serviceWorker.getRegistrations(),
        caches.has(createCacheKey(uuid)),
      ])
      .then(([ registrations, hasCache ]) => registrations.length && hasCache)
      .then(isSaved =>
        dispatch(setStatus(isSaved ? statuses.SAVED : statuses.UNSAVED))
      )
    );
  };
}

function registerServiceWorker() {
  return navigator.serviceWorker.register('/service-worker.js');
}

function cacheCollectionRequest(cache, uuid) {
  const collectionUrl = getServerPath(`/api/collection/${uuid}`);

  return (
    fetch(collectionUrl, { credentials: 'include' })
      .then(response => (
        response.ok ?
          cache.put(collectionUrl, response) :
          Promise.reject(new Error('Failed to fetch collection data'))
      ))
  );
}

export function saveForOffline() {
  return (dispatch, getState) => {
    const state = getState();
    const collection = getCollection(state);
    const { uuid } = collection;
    const subtrees = getSubtreeNames(state);

    const cacheKey = createCacheKey(uuid);

    dispatch(setStatus(statuses.SAVING));
    registerServiceWorker()
      .then(() => caches.open(cacheKey))
      .then(cache => Promise.all([
        cacheCollectionRequest(cache, uuid),
        cache.addAll(subtrees.map(subtree =>
          getServerPath(`/api/collection/${uuid}/subtree/${subtree}`))
        ),
      ]))
      .then(() => saveToOfflineList(collection))
      .then(() => window.location.reload())
      .catch(error => {
        caches.delete(cacheKey);
        dispatch(setStatus(statuses.ERRORED));
        throw error;
      });
  };
}
