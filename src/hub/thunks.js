import actions, { UPLOAD_FASTA } from './actions';

import * as selectors from './selectors';

import { showToast } from '../toast';

import { mapCSVsToFastas, sendToServer } from './utils';
import { getUndoRemoveFastaToast, getDuplicatesToastMessage } from './utils/toasts';

function isDuplicate({ name }, files) {
  return files[name] !== undefined;
}

function uploadFasta(name) {
  return (dispatch, getState) => {
    const { file, metadata } = selectors.getFasta(getState(), name);

    const coords =
      metadata && metadata.latitude && metadata.longitude ?
        { lat: metadata.latitude, lon: metadata.longitude } :
        null;

    return dispatch({
      type: UPLOAD_FASTA,
      payload: {
        name,
        promise: sendToServer({ file, coords }, dispatch),
      },
    }).catch(() => {});
  };
}

const uploadLimit = 5;

export function uploadFiles(files) {
  return (dispatch, getState) => {
    dispatch(actions.addFastas(files));

    const uploads = selectors.getUploads(getState());
    if (uploads.uploading.size > 0) return;

    (function upload() {
      const { queue, uploading } = selectors.getUploads(getState());
      if (queue.length && uploading.size < uploadLimit) {
        dispatch(
          uploadFasta(queue[0])
        ).then(() => { if (queue.length > uploadLimit) upload(); });
        upload();
      }
    }());
  };
}

export function addFiles(newFiles) {
  return (dispatch, getState) => {
    const state = getState();
    const files = selectors.getFastas(state);
    return mapCSVsToFastas(newFiles).then(
      parsedFiles => {
        const duplicates = parsedFiles.filter(file => isDuplicate(file, files));
        const nonDuplicates = parsedFiles.filter(file => !isDuplicate(file, files));

        if (duplicates.length) {
          dispatch(showToast(getDuplicatesToastMessage(duplicates)));
        }
        if (nonDuplicates.length) {
          dispatch(uploadFiles(nonDuplicates));
        }
      }
    );
  };
}

function getNames(fastas, predicate) {
  return fastas.filter(predicate).map(_ => _.name);
}

export function filterByText(text) {
  return (dispatch, getState) => {
    const state = getState();
    const fastas = selectors.getFastasAsList(state);

    if (!text.length) {
      dispatch(actions.filterFastas(text, selectors.getFastaKeys(state)));
      return;
    }

    const regexp = new RegExp(text, 'i');
    dispatch(actions.filterFastas(
      text, getNames(fastas, file => regexp.test(file.name))
    ));
  };
}

export function removeFasta(name) {
  return (dispatch, getState) => {
    const state = getState();
    const fastas = selectors.getFastas(state);
    const fasta = { ...fastas[name] };

    dispatch(actions.removeFasta(name));
    const { message, action } = getUndoRemoveFastaToast(fasta, dispatch);
    dispatch(showToast(message, action));
  };
}
