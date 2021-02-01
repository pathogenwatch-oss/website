import { createAsyncConstants } from '../actions';

import { getOfflineList, removeItem } from './utils';

export const OFFLINE_LOAD_COLLECTIONS =
  createAsyncConstants('OFFLINE_LOAD_COLLECTIONS');

export function loadCollections() {
  return {
    type: OFFLINE_LOAD_COLLECTIONS,
    payload: {
      promise: getOfflineList(),
    },
  };
}

export const OFFLINE_REMOVE_COLLECTION =
  createAsyncConstants('OFFLINE_REMOVE_COLLECTION');

export function removeOfflineCollection(token) {
  return {
    type: OFFLINE_REMOVE_COLLECTION,
    payload: {
      promise: removeItem(token).then(getOfflineList),
    },
  };
}
