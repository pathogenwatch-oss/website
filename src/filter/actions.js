import { updateQueryString, clearQueryString } from '../location';

export const UPDATE_FILTER = 'UPDATE_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';

export function updateFilter(stateKey, filterKey, filterValue) {
  return {
    type: UPDATE_FILTER,
    payload: {
      stateKey, filterKey, filterValue,
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

export function update(stateKey, key, newValue) {
  return dispatch => {
    dispatch(updateFilter(stateKey, key, newValue));
    if (key !== 'prefilter') {
      updateQueryString(key, newValue);
    }
  };
}

export function clear(stateKey, filters) {
  return dispatch => {
    dispatch(clearFilter(stateKey));
    clearQueryString(filters.map(_ => _.queryKey));
  };
}
