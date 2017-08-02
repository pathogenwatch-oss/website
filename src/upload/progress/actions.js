import { createAsyncConstants } from '../../actions';

import * as api from '../api';
import * as selectors from '../selectors';
import { processFiles } from '../actions';

export const UPLOAD_ANALYSIS_RECEIVED = 'UPLOAD_ANALYSIS_RECEIVED';

export function receiveUploadAnalysis(msg) {
  return {
    type: UPLOAD_ANALYSIS_RECEIVED,
    payload: msg,
  };
}

export const UPLOAD_FETCH_GENOMES = createAsyncConstants('UPLOAD_FETCH_GENOMES');

export function fetchGenomes(uploadedAt) {
  return {
    type: UPLOAD_FETCH_GENOMES,
    payload: {
      promise: api.fetchGenomes(uploadedAt),
    },
  };
}

export const UPLOAD_ORGANISM_SELECTED = 'UPLOAD_ORGANISM_SELECTED';

export function selectOrganism(organismId) {
  return {
    type: UPLOAD_ORGANISM_SELECTED,
    payload: {
      organismId,
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

export const REMOVE_GENOMES = 'REMOVE_GENOMES';

export function removeGenomes(ids) {
  return {
    type: REMOVE_GENOMES,
    payload: {
      ids,
    },
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
