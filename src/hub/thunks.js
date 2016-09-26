import actions, { ADD_FASTAS, UPLOAD_FASTA } from './actions';

import * as selectors from './selectors';

import { mapCSVsToFastas, showDuplicatesToast, sendToServer } from './utils';

function isDuplicate({ name }, files) {
  return files[name] !== undefined;
}

export function uploadFasta({ name, file, metadata }) {
  return dispatch => {
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
    });
  };
}

const uploadLimit = 5;

export function uploadFiles(files) {
  return (dispatch, getState) => {
    dispatch({ type: ADD_FASTAS, payload: { fastas: files } });

    (function upload() {
      const { queue, uploading } = selectors.getUploads(getState());
      if (queue.length && uploading.size < uploadLimit) {
        dispatch(
          uploadFasta(files[files.length - queue.length])
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

        if (duplicates.length) showDuplicatesToast(duplicates);
        if (nonDuplicates.length) {
          dispatch(uploadFiles(nonDuplicates));
        }
      }
    );
  };
}

export function createCollection() {
  return (dispatch, getState) => {
    const fastas = selectors.getVisibleFastas(getState());
    dispatch(actions.createCollection(fastas));
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
