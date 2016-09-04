import { createAsyncConstants } from '../actions';

export const ADD_FASTAS = 'ADD_FASTAS';
export const UPLOAD_FASTA = createAsyncConstants('UPLOAD_FASTA');

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

export const FILTER_FASTAS = 'FILTER_FASTAS';

export function filterFastas(fastas, predicate) {
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
