import { createAsyncConstants, createThunk } from '../actions';

import {
  checkCollectionStatus,
  getCollection,
  getReferenceCollection,
  getAntibiotics,
} from '../utils/Api';

import { fixPositions, fixDateFormats } from '../utils/Metadata';

export const FETCH_ENTITIES = createAsyncConstants('FETCH_ENTITIES');

export const fetchEntities = (speciesId, collectionId) =>
  createThunk(
    FETCH_ENTITIES,
    Promise.all([
      getCollection(speciesId, collectionId).then(fixPositions),
      getReferenceCollection(speciesId, collectionId).then(fixDateFormats),
      getAntibiotics(speciesId),
    ])
  );

export const CHECK_STATUS = createAsyncConstants('CHECK_STATUS');

export const checkStatus = (speciesId, collectionId, cas) =>
  createThunk(
    CHECK_STATUS,
    checkCollectionStatus(speciesId, collectionId, cas)
  );

export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

export function updateProgress(results) {
  return {
    type: UPDATE_PROGRESS,
    results,
  };
}
