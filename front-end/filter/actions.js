import { updateQueryString, clearQueryString } from '../location';

export const UPDATE_FILTER = 'UPDATE_FILTER';
export const SET_FILTER = 'SET_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';

export function updateFilter(stateKey, query) {
  return {
    type: UPDATE_FILTER,
    payload: {
      stateKey, query,
    },
  };
}

export function setFilter(stateKey, query) {
  return {
    type: SET_FILTER,
    payload: {
      stateKey, query,
    },
  };
}

export function clearFilter(stateKey) {
  return {
    type: CLEAR_FILTER,
    payload: {
      stateKey,
    },
  };
}

export function update(stateKey, query) {
  return dispatch => {
    dispatch(updateFilter(stateKey, query));
    delete query.prefilter;
    updateQueryString(query);
  };
}

export function clear(stateKey) {
  return dispatch => {
    dispatch(clearFilter(stateKey));
    clearQueryString();
  };
}
