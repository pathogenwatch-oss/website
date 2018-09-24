
import { filterKeys } from './constants';

export const ACTIVATE_FILTER = 'ACTIVATE_FILTER';

export function activateFilter(ids, key = filterKeys.VISIBILITY) {
  return {
    type: ACTIVATE_FILTER,
    payload: {
      ids: new Set(ids),
      key,
    },
  };
}

export const APPEND_TO_FILTER = 'APPEND_TO_FILTER';

export function appendToFilter(ids, key = filterKeys.VISIBILITY) {
  return {
    type: APPEND_TO_FILTER,
    payload: {
      ids: new Set(ids),
      key,
    },
  };
}

export const REMOVE_FROM_FILTER = 'REMOVE_FROM_FILTER';

export function removeFromFilter(ids, key = filterKeys.VISIBILITY) {
  return {
    type: REMOVE_FROM_FILTER,
    payload: {
      ids: new Set(ids),
      key,
    },
  };
}

export const SET_UNFILTERED_IDS = 'SET_UNFILTERED_IDS';

export function setUnfilteredIds(ids) {
  return {
    type: SET_UNFILTERED_IDS,
    payload: {
      ids: new Set(ids),
    },
  };
}

export const RESET_FILTER = 'RESET_FILTER';

export function resetFilter(key = filterKeys.VISIBILITY) {
  return {
    type: RESET_FILTER,
    payload: {
      key,
    },
  };
}

export const CLEAR_FILTERS = 'CLEAR_FILTERS';

export function clearFilters() {
  return {
    type: CLEAR_FILTERS,
    payload: {},
  };
}
