import { createAsyncConstants } from '../actions';

import { getFilter } from './filter/selectors';

import { fetchSummary, fetchList, fetchMap, fetchStats } from './api';

export const FETCH_GENOME_SUMMARY = createAsyncConstants('FETCH_GENOME_SUMMARY');

export function fetchGenomeSummary(filter) {
  return {
    type: FETCH_GENOME_SUMMARY,
    payload: {
      filter,
      promise: fetchSummary(filter),
    },
  };
}

export const FETCH_GENOME_LIST = createAsyncConstants('FETCH_GENOME_LIST');

export function fetchGenomeList(startIndex, stopIndex) {
  const options = { skip: startIndex, limit: stopIndex - startIndex + 1 };
  return (dispatch, getState) => {
    const filter = getFilter(getState());
    return dispatch({
      type: FETCH_GENOME_LIST,
      payload: {
        filter,
        options,
        promise: fetchList({ ...filter, ...options }),
      },
    });
  };
}

export const FETCH_GENOME_MAP = createAsyncConstants('FETCH_GENOME_MAP');

export function fetchGenomeMap() {
  return (dispatch, getState) => {
    const filter = getFilter(getState());
    dispatch({
      type: FETCH_GENOME_MAP,
      payload: {
        filter,
        promise: fetchMap(filter),
      },
    });
  };
}

export const FETCH_GENOME_STATS = createAsyncConstants('FETCH_GENOME_STATS');

export function fetchGenomeStats() {
  return (dispatch, getState) => {
    const filter = getFilter(getState());
    dispatch({
      type: FETCH_GENOME_STATS,
      payload: {
        filter,
        promise: fetchStats(filter),
      },
    });
  };
}
