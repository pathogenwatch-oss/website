import { createAsyncConstants } from '../actions';

import * as selectors from './selectors';
import * as utils from './utils';
import * as api from './api';

import { showToast } from '../toast';

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
    const { id, hasMetadata, ...metadata } = genome;
    const progressFn =
      percent => dispatch(genomeUploadProgress(id, percent));

    return dispatch({
      type: UPLOAD_GENOME,
      payload: {
        id,
        promise:
          api.upload(genome, data, progressFn)
            .then(uploadResult => {
              if (hasMetadata) {
                return api.update(uploadResult.id, metadata)
                  .then(updateResult => ({ ...uploadResult, ...updateResult }));
              }
              return uploadResult;
            }),
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
            .then(data => {
              if (selectors.getSettingValue(getState(), 'compression')) {
                return dispatch(compressGenome(id, data));
              }
              return data;
            })
            .then(data => dispatch(uploadGenome(genome, data))),
      },
    }).catch(() => {});
  };
}

const defaultProcessLimit = 3;

export function processFiles(files) {
  return (dispatch, getState) => {
    dispatch(addGenomes(files));

    const state = getState();
    if (selectors.isUploading(state)) return;

    const isIndividual = selectors.getSettingValue(state, 'individual');
    const processLimit = isIndividual ? 1 : defaultProcessLimit;

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

export const UPLOAD_SETTING_CHANGED = 'UPLOAD_SETTING_CHANGED';

export function changeUploadSetting(setting, value) {
  return {
    type: UPLOAD_SETTING_CHANGED,
    payload: {
      setting,
      value,
    },
  };
}
