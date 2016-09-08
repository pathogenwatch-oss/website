import { createAsyncConstants } from '../actions';

import { createCollection as createCollectionPromise } from './utils';

export const ADD_FASTAS = 'ADD_FASTAS';
export const UPLOAD_FASTA = createAsyncConstants('UPLOAD_FASTA');

export const UPDATE_FASTA_PROGRESS = 'UPDATE_FASTA_PROGRESS';

function updateFastaProgress(name, progress) {
  return {
    type: UPDATE_FASTA_PROGRESS,
    payload: {
      name,
      progress,
    },
  };
}

export const FILTER_BY_TEXT = 'FILTER_BY_TEXT';

function filterByText(searchText) {
  return {
    type: FILTER_BY_TEXT,
    payload: {
      searchText,
    },
  };
}

export const FILTER_BY_SPECIES = 'FILTER_BY_SPECIES';

function filterBySpecies(speciesKey) {
  return {
    type: FILTER_BY_SPECIES,
    speciesKey,
  };
}

export const CLEAR_FILTER = 'CLEAR_FILTER';

function clearFilter() {
  return {
    type: CLEAR_FILTER,
  };
}

export const CREATE_COLLECTION = createAsyncConstants('CREATE_COLLECTION');

function createCollection(files) {
  const speciesId = files[0].speciesId;
  return {
    type: CREATE_COLLECTION,
    payload: {
      speciesId,
      promise: createCollectionPromise(files, speciesId),
    },
  };
}

export default {
  updateFastaProgress,
  filterByText,
  clearFilter,
  filterBySpecies,
  createCollection,
};
