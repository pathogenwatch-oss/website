import { createAsyncConstants } from '~/actions';

import * as selectors from './selectors';
import { getUploadedAt } from '../selectors';

import { getAuthToken } from '~/auth/actions';

import * as api from './api';
import { compress, validate } from './utils';
import { upload } from '../assembly/service';

import { fileTypes } from '../../constants';

export const GENOME_UPLOAD_PROGRESS = 'GENOME_UPLOAD_PROGRESS';

export function genomeUploadProgress(id, progress) {
  return {
    type: GENOME_UPLOAD_PROGRESS,
    payload: {
      id,
      progress,
    },
  };
}

export const COMPRESS_GENOME = createAsyncConstants('COMPRESS_GENOME');

export function compressGenome(id, text) {
  return {
    type: COMPRESS_GENOME,
    payload: {
      id,
      promise: compress(text),
    },
  };
}

export const UPLOAD_GENOME = createAsyncConstants('UPLOAD_GENOME');

export function uploadGenome(genome, data) {
  return dispatch => {
    const { id, metadata } = genome;
    const progressFn = percent => dispatch(genomeUploadProgress(id, percent));

    return dispatch({
      type: UPLOAD_GENOME,
      payload: {
        id,
        promise: api.upload(genome, data, progressFn).then(uploadResult => {
          if (metadata) {
            return api
              .update(uploadResult.id, metadata)
              .then(updateResult => ({ ...uploadResult, ...updateResult }));
          }
          return uploadResult;
        }),
      },
    });
  };
}

function processAssembly(dispatch, getState, genome) {
  return (
    validate(genome)
      // .then(data => {
      //   if (getSettingValue(getState(), 'compression')) {
      //     return dispatch(compressGenome(genome.id, data));
      //   }
      //   return data;
      // })
      .then(data => dispatch(uploadGenome(genome, data)))
  );
}

function processReads(dispatch, getState, genome) {
  const state = getState();
  const uploadedAt = getUploadedAt(state);
  // TODO: determine this from state
  const recovery = false;
  const token = state.auth.token;
  return upload(genome, { token, uploadedAt, recovery }, dispatch);
}

export const PROCESS_GENOME = createAsyncConstants('PROCESS_GENOME');

function processGenome(id) {
  return (dispatch, getState) => {
    const state = getState();
    const genome = selectors.getGenome(state, id);
    return dispatch({
      type: PROCESS_GENOME,
      payload: {
        id,
        promise:
          genome.type === fileTypes.READS
            ? processReads(dispatch, getState, genome)
            : processAssembly(dispatch, getState, genome),
      },
    }).catch(error => error);
  };
}

export function processFiles() {
  return (dispatch, getState) => {
    if (selectors.isUploading(getState())) return;

    // const isIndividual = getSettingValue(state, 'individual');
    // const processLimit = isIndividual ? 1 : 5;
    const processLimit = 1;

    dispatch(getAuthToken()).then(() =>
      (function processNext() {
        const state = getState();
        const queue = selectors.getUploadQueue(state);
        const processing = selectors.getProcessing(state);
        if (queue.length && processing.size < processLimit) {
          dispatch(processGenome(queue[0])).then(() => {
            if (queue.length > processLimit) {
              processNext();
              return;
            }
          });
          processNext();
        }
      }())
    );
  };
}
