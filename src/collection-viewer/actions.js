import { createAsyncConstants } from '../actions';

import { getCollection } from './api';
import { fetchQueuePosition } from '../upload/api';

import Organisms from '../organisms';

export const FETCH_COLLECTION = createAsyncConstants('FETCH_COLLECTION');

export function fetchCollection(collectionId) {
  return {
    type: FETCH_COLLECTION,
    payload: {
      promise:
        getCollection(collectionId)
          .then(result => {
            Organisms.current = result.organismId;
            return result;
          }),
    },
  };
}

export const UPDATE_COLLECTION_PROGRESS = 'UPDATE_COLLECTION_PROGRESS';

export function updateProgress(message) {
  return {
    type: UPDATE_COLLECTION_PROGRESS,
    payload: message,
  };
}

export const RESET_COLLECTION_VIEW = 'RESET_COLLECTION_VIEW';

export function resetCollectionView() {
  return {
    type: RESET_COLLECTION_VIEW,
  };
}

export const COLLECTION_FETCH_POSITION =
  createAsyncConstants('COLLECTION_FETCH_POSITION');

export function fetchPosition(started) {
  return {
    type: COLLECTION_FETCH_POSITION,
    payload: {
      promise: fetchQueuePosition(started),
    },
  };
}
