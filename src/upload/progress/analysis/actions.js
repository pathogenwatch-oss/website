import { createAsyncConstants } from '~/actions';

import * as api from './api';

export const UPLOAD_ANALYSIS_RECEIVED = 'UPLOAD_ANALYSIS_RECEIVED';

export function receiveUploadAnalysis(msg) {
  return {
    type: UPLOAD_ANALYSIS_RECEIVED,
    payload: msg,
  };
}

export const UPLOAD_FETCH_POSITION = createAsyncConstants(
  'UPLOAD_FETCH_POSITION'
);

export function fetchQueuePosition(uploadedAt) {
  return {
    type: UPLOAD_FETCH_POSITION,
    payload: {
      uploadedAt,
      promise: api.fetchQueuePosition(uploadedAt),
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
