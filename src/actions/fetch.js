import { createAsyncConstants } from '../actions';

import {
  checkCollectionStatus,
  getCollection,
  getReferenceCollection,
  getResistanceData,
} from '../utils/Api';

import { fixPositions, fixDateFormats } from '../utils/Metadata';

export const FETCH_ENTITIES = createAsyncConstants('FETCH_ENTITIES');

export const fetchEntities = (speciesId, collectionId) => ({
  type: FETCH_ENTITIES,
  payload: {
    promise: Promise.all([
      getCollection(speciesId, collectionId).then(fixPositions),
      getReferenceCollection(speciesId, collectionId).then(fixDateFormats),
      getResistanceData(speciesId),
    ]),
  },
});

export const CHECK_STATUS = createAsyncConstants('CHECK_STATUS');

export const checkStatus = (collectionId) => ({
  type: CHECK_STATUS,
  payload: {
    promise: checkCollectionStatus(collectionId),
  },
});

export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

export function updateProgress(result) {
  return {
    type: UPDATE_PROGRESS,
    payload: {
      result,
    },
  };
}
