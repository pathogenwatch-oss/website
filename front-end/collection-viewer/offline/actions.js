import { getCollection } from '../selectors';
import { getSubtreeNames } from '../tree/selectors/entities';

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
        .catch(err => {
          console.error(err);
          dispatch(setStatus(statuses.ERRORED));
        })
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
    const { uuid, token } = collection;
    const subtrees = getSubtreeNames(state);

    const cacheKey = createCacheKey(uuid);

    dispatch(setStatus(statuses.SAVING));
    registerServiceWorker()
      .then(() => caches.open(cacheKey))
      .then(cache => Promise.all([
        cacheCollectionRequest(cache, token),
        cache.addAll(subtrees.map(subtree =>
          getServerPath(`/api/collection/${token}/tree/${encodeURIComponent(subtree)}`))
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
