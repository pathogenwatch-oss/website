import { createAsyncConstants } from '../actions';

import * as api from './api';

export const FETCH_GENOME_SUMMARY = createAsyncConstants('FETCH_GENOME_SUMMARY');

export function fetchSummary(filter) {
  return {
    type: FETCH_GENOME_SUMMARY,
    payload: {
      promise: api.fetchSummary(filter),
    },
  };
}

export const FETCH_GENOMES = createAsyncConstants('FETCH_GENOMES');

export function fetchGenomes(filter) {
  return {
    type: FETCH_GENOMES,
    payload: {
      filter,
      promise: api.fetchGenomes(filter),
    },
  };
}
