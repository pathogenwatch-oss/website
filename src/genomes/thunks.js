import actions, { UPLOAD_GENOME } from './actions';

import * as selectors from './selectors';

import { showToast } from '../toast';

import * as utils from './utils';
import * as toasts from './utils/toasts';

function isDuplicate({ name }, files) {
  return files[name] !== undefined;
}

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
    dispatch(actions.addGenomes(files));

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

function getIds(genomes, predicate) {
  return genomes.filter(predicate).map(_ => _.id);
}

export function filterByText(text) {
  return (dispatch, getState) => {
    const state = getState();
    const genomes = selectors.getGenomesAsList(state);

    if (!text.length) {
      dispatch(actions.filterGenomes(text, selectors.getGenomeKeys(state)));
      return;
    }

    const regexp = new RegExp(text, 'i');
    dispatch(actions.filterGenomes(
      text, getIds(genomes, file => regexp.test(file.name))
    ));
  };
}

export function removeGenome(genome) {
  return (dispatch) => {
    dispatch(actions.removeGenome(genome.id));
    dispatch(showToast(toasts.undoRemoveGenome(genome, dispatch)));
  };
}
