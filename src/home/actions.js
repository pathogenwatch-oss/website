import { createAsyncConstants } from '../actions';

import * as api from './api';

export const FETCH_SPECIES_SUMMARY = createAsyncConstants('FETCH_SPECIES_SUMMARY');

export function fetchSummary() {
  return {
    type: FETCH_SPECIES_SUMMARY,
    payload: {
      promise: api.fetchSummary(),
    },
  };
}
