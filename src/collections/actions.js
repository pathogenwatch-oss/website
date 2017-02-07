import { createAsyncConstants } from '../actions';

import * as api from './api';

export const FETCH_COLLECTIONS = createAsyncConstants('FETCH_COLLECTIONS');

export function fetchCollections() {
  return {
    type: FETCH_COLLECTIONS,
    payload: {
      promise: api.fetch(),
    },
  };
}
