import actions, { UPLOAD_GENOME } from './actions';

import * as selectors from './selectors';

import { showToast } from '../toast';

import * as utils from './utils';
import * as toasts from './utils/toasts';

function isDuplicate({ name }, files) {
  return files[name] !== undefined;
}

function uploadGenome(name) {
  return (dispatch, getState) =>
    dispatch({
      type: UPLOAD_GENOME,
      payload: {
        name,
        promise: utils.upload(selectors.getGenome(getState(), name), dispatch),
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
  return (dispatch, getState) => {
    const state = getState();
    const files = selectors.getGenomes(state);
    return utils.mapCSVsToGenomes(newFiles).then(
      parsedFiles => {
        const duplicates = parsedFiles.filter(file => isDuplicate(file, files));
        const nonDuplicates = parsedFiles.filter(file => !isDuplicate(file, files));

        if (duplicates.length) {
          dispatch(showToast(toasts.notifyDuplicates(duplicates)));
        }
        if (nonDuplicates.length) {
          dispatch(uploadFiles(nonDuplicates));
        }
      }
    );
  };
}

function getNames(genomes, predicate) {
  return genomes.filter(predicate).map(_ => _.name);
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
      text, getNames(genomes, file => regexp.test(file.name))
    ));
  };
}

export function removeGenome(name) {
  return (dispatch, getState) => {
    const state = getState();
    const genomes = selectors.getGenomes(state);
    const genome = { ...genomes[name] };

    dispatch(actions.removeGenome(name));
    dispatch(showToast(toasts.undoRemoveGenome(genome, dispatch)));
  };
}
