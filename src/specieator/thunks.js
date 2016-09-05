import actions, { ADD_FASTAS, UPLOAD_FASTA } from './actions';

import { getFastas, getFastasAsList, getVisibleFastas } from './selectors';

import { showDuplicatesToast, sendToServer } from './utils';

export function addFiles(newFiles) {
  return (dispatch, getState) => {
    const state = getState();
    const files = getFastas(state);

    const duplicates = newFiles.filter(file => file.name in files);
    const nonDuplicates = newFiles.filter(file => !(file.name in files));

    if (duplicates.length) showDuplicatesToast(duplicates);
    if (nonDuplicates.length) {
      dispatch({ type: ADD_FASTAS, payload: { files: nonDuplicates } });
    }
  };
}

export function uploadFasta(name) {
  return (dispatch, getState) => {
    const state = getState();

    const { file } = getFastas(state)[name];

    dispatch({
      type: UPLOAD_FASTA,
      payload: {
        name,
        promise: sendToServer(file, dispatch),
      },
    });
  };
}

export function createCollection() {
  return (dispatch, getState) => {
    const fastas = getVisibleFastas(getState());
    dispatch(actions.createCollection(fastas));
  };
}

export function filterByText(text) {
  return (dispatch, getState) => {
    const state = getState();
    const fastas = getFastasAsList(state);

    if (!text.length) {
      dispatch(actions.filterFastas(fastas, () => true));
      return;
    }

    const regexp = new RegExp(text, 'i');
    dispatch(actions.filterFastas(fastas, file => regexp.test(file.name)));
  };
}
