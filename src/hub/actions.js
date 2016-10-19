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

export const CREATE_COLLECTION = createAsyncConstants('CREATE_COLLECTION');

function createCollection(files, metadata) {
  const speciesId = files[0].speciesId;
  return {
    type: CREATE_COLLECTION,
    payload: {
      speciesId,
      metadata,
      promise: createCollectionPromise(files, speciesId, metadata),
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

export const SHOW_METRIC = 'SHOW_METRIC';

function showMetric(metric) {
  return {
    type: SHOW_METRIC,
    payload: { metric },
  };
}

export const CHANGE_COLLECTION_METADATA = 'CHANGE_COLLECTION_METADATA';

function changeCollectionMetadata(field, value) {
  return {
    type: CHANGE_COLLECTION_METADATA,
    payload: {
      [field]: value,
    },
  };
}

export default {
  addFastas,
  updateFastaProgress,
  createCollection,
  removeFasta,
  undoRemoveFasta,
  showMetric,
  changeCollectionMetadata,
};
