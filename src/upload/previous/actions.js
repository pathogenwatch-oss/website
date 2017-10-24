import { createAsyncConstants } from '../../actions';

import { fetchUploads as fetch } from '../api';

export const FETCH_UPLOADS = createAsyncConstants('FETCH_UPLOADS');

export function fetchUploads() {
  return {
    type: FETCH_UPLOADS,
    payload: {
      promise: fetch(),
    },
  };
}
