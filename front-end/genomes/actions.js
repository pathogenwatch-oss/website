import Bottleneck from 'bottleneck';
import { createAsyncConstants } from '~/actions';

import { getFilter } from './filter/selectors';

import { fetchList, fetchMap, fetchStats, fetchSummary } from './api';

export const FETCH_GENOME_SUMMARY = createAsyncConstants('FETCH_GENOME_SUMMARY');

const listLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 50,
});

const summaryLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 50,
});

export function fetchGenomeSummary(filter) {
  return {
    type: FETCH_GENOME_SUMMARY,
    payload: {
      filter,
      promise: summaryLimiter.schedule(() => fetchSummary(filter)),
    },
  };
}

export const FETCH_GENOME_LIST = createAsyncConstants('FETCH_GENOME_LIST');

const isDefined = (value) => (typeof value !== 'undefined' && value !== null);

export function fetchGenomeList(startIndex, stopIndex) {
  let skip;
  let limit;
  if (isDefined(startIndex)) {
    skip = startIndex;
    if (isDefined(stopIndex)) {
      limit = stopIndex - startIndex + 1;
    }
  }
  const options = { skip, limit };
  return (dispatch, getState) => {
    const filter = getFilter(getState());
    return dispatch({
      type: FETCH_GENOME_LIST,
      payload: {
        filter,
        options,
        promise: listLimiter.schedule(() => fetchList({ ...filter, ...options })),
      },
    });
  };
}

export const FETCH_GENOME_SELECTION = createAsyncConstants('FETCH_GENOME_SELECTION');

export function fetchGenomeSelection(skip, limit) {
  const options = { skip, limit, noSort: true };
  return (dispatch, getState) => {
    const filter = getFilter(getState());
    return dispatch({
      type: FETCH_GENOME_SELECTION,
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
