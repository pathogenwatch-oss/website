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

export const FILTER_FASTAS = 'FILTER_FASTAS';

function filterFastas(fastas, predicate) {
  if (fastas) {
    return {
      type: FILTER_FASTAS,
      payload: {
        active: true,
        ids: (
          fastas.
            filter(predicate).
            map(file => file.name)
        ),
      },
    };
  }

  return {
    type: FILTER_FASTAS,
    payload: { active: false },
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
  filterFastas,
  createCollection,
};
