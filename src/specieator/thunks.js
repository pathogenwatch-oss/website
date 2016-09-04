import { createAsyncConstants } from '../actions';

import { ADD_FASTAS, UPLOAD_FASTA } from './actions';

import { getFastas, getFastasAsList } from './reducers/fastas';

import {
  showDuplicatesToast,
  createCollection as createCollectionPromise,
  sendToServer,
} from './utils';


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


export const CREATE_COLLECTION = createAsyncConstants('CREATE_COLLECTION');

export function createCollection() {
  return (dispatch, getState) => {
    const fastas = getFastas(getState());

    const files = Object.keys(fastas).map(_ => fastas[_]);
    const speciesId = files[0].speciesId;

    dispatch({
      type: CREATE_COLLECTION,
      payload: {
        speciesId,
        promise: createCollectionPromise(files, speciesId),
      },
    });
  };
}


export const FILTER_FASTAS = 'FILTER_FASTAS';

export function filterFastas(text) {
  return (dispatch, getState) => {
    if (!text.length) {
      dispatch({
        type: FILTER_FASTAS,
        payload: { active: false },
      });
      return;
    }

    const regexp = new RegExp(text, 'i');
    dispatch({
      type: FILTER_FASTAS,
      payload: {
        active: true,
        ids: (
          getFastasAsList(getState()).
            filter(file => regexp.test(file.name)).
            map(file => file.name)
        ),
      },
    });
  };
}
