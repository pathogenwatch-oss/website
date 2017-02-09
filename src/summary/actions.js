import { createAsyncConstants } from '../actions';

import { fetch } from './api';

export const FETCH_SUMMARY = createAsyncConstants('FETCH_SUMMARY');

export function fetchSummary() {
  return {
    type: FETCH_SUMMARY,
    payload: {
      promise: fetch(),
    },
  };
}
