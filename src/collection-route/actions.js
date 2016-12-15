import { createAsyncConstants } from '../actions';

import {
  getCollection,
  getReferenceCollection,
  getResistanceData,
} from '../utils/Api';

export const FETCH_COLLECTION = createAsyncConstants('FETCH_COLLECTION');

export const fetchCollection = (collectionId) => ({
  type: FETCH_COLLECTION,
  payload: {
    promise: getCollection(collectionId),
  },
});

export const UPDATE_COLLECTION_PROGRESS = 'UPDATE_COLLECTION_PROGRESS';

export function updateProgress({ status, progress }) {
  return {
    type: UPDATE_COLLECTION_PROGRESS,
    payload: {
      status,
      progress,
    },
  };
}

export const FETCH_SPECIES_DATA = createAsyncConstants('FETCH_SPECIES_DATA');

export function fetchSpeciesData(speciesId) {
  return {
    type: FETCH_SPECIES_DATA,
    payload: {
      promise: Promise.all([
        getReferenceCollection(speciesId),
        getResistanceData(speciesId),
      ]),
    },
  };
}

export const RESET_COLLECTION_VIEW = 'RESET_COLLECTION_VIEW';

export function resetCollectionView() {
  return {
    type: RESET_COLLECTION_VIEW,
  };
}
