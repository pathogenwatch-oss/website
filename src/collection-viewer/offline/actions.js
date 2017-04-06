import { getCollection } from '../selectors';
import { getSubtreeNames } from '../tree/selectors';

import { statuses } from './constants';
import { API_ROOT } from '../../utils/Api';

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
        caches.has(`wgsa-collection-${uuid}`),
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

export function saveForOffline() {
  return (dispatch, getState) => {
    const state = getState();
    const { uuid } = getCollection(state);
    const subtrees = getSubtreeNames(state);

    dispatch(setStatus(statuses.SAVING));
    registerServiceWorker()
      .then(() => caches.open(`wgsa-collection-${uuid}`))
      .then(cache => cache.addAll(
        subtrees
          .map(subtree => `${API_ROOT}/collection/${uuid}/subtree/${subtree}`)
          .concat(`${API_ROOT}/collection/${uuid}`)
      ))
      .then(() => window.location.reload());
  };
}
