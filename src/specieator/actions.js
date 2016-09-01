import { createAsyncConstants } from '../actions';

export const ADD_FASTAS = 'ADD_FASTAS';

export function addFastas(files) {
  return {
    type: ADD_FASTAS,
    payload: {
      files,
    },
  };
}

export const UPLOAD_FASTA = createAsyncConstants('UPLOAD_FASTA');

export function uploadFasta(name, uploadPromise) {
  return {
    type: UPLOAD_FASTA,
    payload: {
      name,
      promise: uploadPromise,
    },
  };
}

export const UPDATE_FASTA_PROGRESS = 'UPDATE_FASTA_PROGRESS';

export function updateFastaProgress(name, progress) {
  return {
    type: UPDATE_FASTA_PROGRESS,
    payload: {
      name,
      progress,
    },
  };
}

export const CREATE_COLLECTION = createAsyncConstants('CREATE_COLLECTION');

import { createCollection as createCollectionPromise } from './utils';

export function createCollection() {
  return (dispatch, getState) => {
    const { entities: { fastas } } = getState();

    const files = Object.keys(fastas).map(_ => fastas[_]);
    const speciesId = files[0].speciesId;

    dispatch({
      type: CREATE_COLLECTION,
      payload: {
        speciesId,
        promise: createCollectionPromise(files, speciesId),
      },
    });
  };
}
