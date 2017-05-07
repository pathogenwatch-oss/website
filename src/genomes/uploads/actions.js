import { createAsyncConstants } from '../../actions';

import * as selectors from './selectors';
import * as utils from '../utils';
import * as api from './api';

import { showToast } from '../../toast';

export const ADD_GENOMES = 'ADD_GENOMES';

export function addGenomes(genomes) {
  return {
    type: ADD_GENOMES,
    payload: { genomes },
  };
}

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
      promise: utils.compress(text),
    },
  };
}

export const UPLOAD_GENOME = createAsyncConstants('UPLOAD_GENOME');

export function uploadGenome(genome, data) {
  return dispatch => {
    const progressFn =
      percent => dispatch(genomeUploadProgress(genome.id, percent));
    return dispatch({
      type: UPLOAD_GENOME,
      payload: {
        id: genome.id,
        promise: api.upload(genome, data, progressFn),
      },
    });
  };
}

export const UPDATE_GENOME = createAsyncConstants('UPDATE_GENOME');

export function updateGenome(id, metadata) {
  return {
    type: UPDATE_GENOME,
    payload: {
      id,
      promise: api.update(id, metadata),
    },
  };
}

export const PROCESS_GENOME = createAsyncConstants('PROCESS_GENOME');

function processGenome(id) {
  return (dispatch, getState) => {
    const genome = selectors.getGenome(getState(), id);
    return dispatch({
      type: PROCESS_GENOME,
      payload: {
        id,
        promise:
          utils.validate(genome)
            .then(data => dispatch(compressGenome(id, data)))
            .then(data => dispatch(uploadGenome(genome, data)))
            .then(result => (
              genome.hasMetadata ?
                dispatch(updateGenome(result.id, genome)) :
                result
            )),
      },
    }).catch(() => {});
  };
}

const processLimit = 5;

export function processFiles(files) {
  return (dispatch, getState) => {
    dispatch(addGenomes(files));

    if (selectors.isUploading(getState())) return;

    (function processNext() {
      const { queue, processing } = selectors.getUploads(getState());
      if (queue.length && processing.size < processLimit) {
        dispatch(processGenome(queue[0]))
          .then(() => {
            if (queue.length > processLimit) {
              processNext();
              return;
            }
          });
        processNext();
      }
    }());
  };
}

export function addFiles(newFiles) {
  return (dispatch) =>
    utils.mapCSVsToGenomes(newFiles)
      .then(parsedFiles => dispatch(processFiles(parsedFiles)))
      .catch(error => {
        if (error.toast) {
          dispatch(showToast(error.toast));
        }
      });
}

export const REMOVE_GENOMES = 'REMOVE_GENOMES';

export function removeGenomes(ids) {
  return {
    type: REMOVE_GENOMES,
    payload: {
      ids,
    },
  };
}

export function retryAll() {
  return (dispatch, getState) => {
    const state = getState();
    if (selectors.isUploading(state)) return;

    const failedUploads = selectors.getFailedUploads(state);
    if (!failedUploads.length) return;

    dispatch(processFiles(failedUploads));
  };
}

export function removeAll() {
  return (dispatch, getState) => {
    const state = getState();
    if (selectors.isUploading(state)) return;

    const erroredUploads = selectors.getErroredUploads(state);
    if (!erroredUploads.length) return;

    dispatch(removeGenomes(erroredUploads.map(_ => _.id)));
  };
}
