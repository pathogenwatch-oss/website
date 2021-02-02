import { createAsyncConstants } from '../actions';

import * as api from './api';

export const FETCH_ACCOUNT_ACTIVITY = createAsyncConstants('FETCH_ACCOUNT_ACTIVITY');

export function fetchActivity() {
  return {
    type: FETCH_ACCOUNT_ACTIVITY,
    payload: {
      promise: api.fetchActivity(),
    },
  };
}
