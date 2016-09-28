import { createAsyncConstants } from '../actions';

import { createCollection as createCollectionPromise } from './utils';

export const ADD_FASTAS = 'ADD_FASTAS';

function addFastas(fastas) {
  return {
    type: ADD_FASTAS,
    payload: { fastas },
  };
}

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

export const FILTER_BY_METADATA = 'FILTER_BY_METADATA';

function filterByMetadata(key, value) {
  return {
    type: FILTER_BY_METADATA,
    key, value,
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

export const REMOVE_FASTA = 'REMOVE_FASTA';

function removeFasta(name) {
  return {
    type: REMOVE_FASTA,
    payload: { name },
  };
}

export const UNDO_REMOVE_FASTA = 'UNDO_REMOVE_FASTA';

function undoRemoveFasta(fasta) {
  return {
    type: UNDO_REMOVE_FASTA,
    payload: { fasta },
  };
}

export default {
  addFastas,
  updateFastaProgress,
  filterByText,
  clearFilter,
  filterByMetadata,
  createCollection,
  removeFasta,
  undoRemoveFasta,
};
