import { createAsyncConstants } from '../../../actions';

import * as api from './api';

export const TOGGLE_UPDATE_METADATA = 'TOGGLE_UPDATE_METADATA';

export function toggleUpdateMetadata() {
  return {
    type: TOGGLE_UPDATE_METADATA,
  };
}

export const SEND_METADATA_UPDATE = createAsyncConstants(
  'SEND_METADATA_UPDATE'
);

export function sendMetadataUpdate(data) {
  return {
    type: SEND_METADATA_UPDATE,
    payload: {
      data,
      promise: api.updateMetadata(data),
    },
  };
}
