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
