import { createAsyncConstants } from '../actions';

import { getFilter } from './filter/selectors';

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

export function fetchGenomes(options) {
  return (dispatch, getState) => {
    const filter = getFilter(getState());
    dispatch({
      type: FETCH_GENOMES,
      payload: {
        filter,
        options,
        promise: api.fetchGenomes({ ...filter, ...options }),
      },
    });
  };
}
