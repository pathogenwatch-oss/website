import { updateQueryString, clearQueryString } from '../location';

export const UPDATE_FILTER = 'UPDATE_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';

export function updateFilter(stateKey, { queryKey, key }, filterValue) {
  return dispatch =>
    (queryKey ?
      updateQueryString(queryKey, filterValue) :
      dispatch({
        type: UPDATE_FILTER,
        payload: {
          stateKey, filterKey: key, filterValue,
        },
      })
    );
}

export function clearFilter(stateKey, filters) {
  return dispatch => {
    dispatch({
      type: CLEAR_FILTER,
      payload: {
        stateKey,
      },
    });
    clearQueryString(filters.map(_ => _.queryKey));
  };
}
