import { createAsyncConstants } from '~/actions';

import * as api from '../api';

export const UPLOAD_FETCH_GENOMES = createAsyncConstants(
  'UPLOAD_FETCH_GENOMES'
);

export function fetchGenomes(uploadedAt) {
  return {
    type: UPLOAD_FETCH_GENOMES,
    payload: {
      uploadedAt,
      promise: api.fetchGenomes(uploadedAt),
    },
  };
}

export const UPLOAD_RESET = 'UPLOAD_RESET';

export function resetUpload() {
  return {
    type: UPLOAD_RESET,
  };
}
