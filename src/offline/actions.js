import { createAsyncConstants } from '../actions';

import { getOfflineList } from './utils';

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
