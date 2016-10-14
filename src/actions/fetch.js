import { createAsyncConstants } from '../actions';

import {
  checkCollectionStatus,
  getCollection,
  getReferenceCollection,
  getAntibiotics,
} from '../utils/Api';

import { fixPositions, fixDateFormats } from '../utils/Metadata';

export const FETCH_ENTITIES = createAsyncConstants('FETCH_ENTITIES');

export const fetchEntities = (speciesId, collectionId) => ({
  type: FETCH_ENTITIES,
  payload: {
    promise: Promise.all([
      getCollection(speciesId, collectionId).then(fixPositions),
      getReferenceCollection(speciesId, collectionId).then(fixDateFormats),
      getAntibiotics(speciesId),
    ]),
  },
});

export const CHECK_STATUS = createAsyncConstants('CHECK_STATUS');

export const checkStatus = (speciesId, collectionId, cas) => ({
  type: CHECK_STATUS,
  payload: {
    promise: checkCollectionStatus(speciesId, collectionId, cas),
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
