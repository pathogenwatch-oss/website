import { createAsyncConstants } from '~/actions';

import * as api from './api';

export const ADD_GENOMES = createAsyncConstants('ADD_GENOMES');

export function addGenomes(genomes, uploadedAt) {
  return {
    type: ADD_GENOMES,
    payload: {
      genomes,
      uploadedAt,
      promise: api.initialise(genomes, uploadedAt).then(result => {
        for (const genome of genomes) {
          if (genome.id in result) {
            genome.id = result[genome.id];
          }
        }
        return result;
      }),
    },
  };
}

export const UPLOAD_ERROR_MESSAGE = 'UPLOAD_ERROR_MESSAGE';

export function uploadErrorMessage(message) {
  return {
    type: UPLOAD_ERROR_MESSAGE,
    payload: message,
  };
}
