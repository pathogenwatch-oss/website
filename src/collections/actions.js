import { createAsyncConstants } from '../actions';

import * as api from './api';

export const FETCH_COLLECTION_SUMMARY = createAsyncConstants('FETCH_COLLECTION_SUMMARY');

export function fetchSummary(filter) {
  return {
    type: FETCH_COLLECTION_SUMMARY,
    payload: {
      promise: api.fetchSummary(filter),
    },
  };
}

export const FETCH_COLLECTIONS = createAsyncConstants('FETCH_COLLECTIONS');

export function fetchCollections(filter) {
  return {
    type: FETCH_COLLECTIONS,
    payload: {
      promise: api.fetchCollections(filter),
    },
  };
}
