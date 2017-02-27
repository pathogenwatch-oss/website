import { createAsyncConstants } from '../../actions';

import { showToast } from '../../toast';

import * as selectors from './selectors';
import * as utils from '../utils';
import * as toasts from '../utils/toasts';

export const ADD_GENOMES = 'ADD_GENOMES';

export function addGenomes(genomes) {
  return {
    type: ADD_GENOMES,
    payload: { genomes },
  };
}

export const UPDATE_GENOME_PROGRESS = 'UPDATE_GENOME_PROGRESS';

export function updateGenomeProgress(id, progress) {
  return {
    type: UPDATE_GENOME_PROGRESS,
    payload: {
      id,
      progress,
    },
  };
}

export const UPLOAD_GENOME = createAsyncConstants('UPLOAD_GENOME');

function uploadGenome(id) {
  return (dispatch, getState) =>
    dispatch({
      type: UPLOAD_GENOME,
      payload: {
        id,
        promise: utils.upload(selectors.getGenome(getState(), id), dispatch),
      },
    }).catch(() => {});
}

const uploadLimit = 5;

export function uploadFiles(files) {
  return (dispatch, getState) => {
    dispatch(addGenomes(files));

    if (selectors.isUploading(getState())) return;

    (function upload() {
      const { queue, uploading } = selectors.getUploads(getState());
      if (queue.length && uploading.size < uploadLimit) {
        dispatch(
          uploadGenome(queue[0])
        ).then(() => {
          if (queue.length > uploadLimit) {
            upload();
            return;
          }

          const state = getState();
          if (selectors.isUploading(state)) return;

          const failedUploads = selectors.getFailedUploads(state);
          if (!failedUploads.length) return;

          dispatch(showToast(toasts.retryAll(
            failedUploads.length,
            () => dispatch(uploadFiles(failedUploads))
          )));
        });
        upload();
      }
    }());
  };
}

export function addFiles(newFiles) {
  return (dispatch) =>
    utils.mapCSVsToGenomes(newFiles).then(
      parsedFiles => dispatch(uploadFiles(parsedFiles))
    );
}

export const REMOVE_GENOME = 'REMOVE_GENOME';

export function removeGenome(id) {
  return {
    type: REMOVE_GENOME,
    payload: {
      id,
    },
  };
}
