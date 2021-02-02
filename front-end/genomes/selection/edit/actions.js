import { createAsyncConstants } from '../../../actions';

import * as api from './api';

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
