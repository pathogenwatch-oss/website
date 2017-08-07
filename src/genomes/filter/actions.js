import { stateKey } from './index';

import { actions } from '../../filter';
import { fetchSummary, fetchGenomes } from '../actions';

import { getFilter } from './selectors';

export function updateFilter(query, updateQueryString = true) {
  return (dispatch, getState) => {
    const update = updateQueryString ? actions.update : actions.setFilter;
    dispatch(update(stateKey, query));

    const state = getState();
    const currentFilter = getFilter(state);

    const filterQuery = { ...currentFilter };

    const queryKeys = Object.keys(query);
    if (queryKeys.length === 1 && queryKeys[0] === 'sort') {
      return dispatch(fetchGenomes());
    }

    return dispatch(fetchSummary(filterQuery));
  };
}

export function clearFilter() {
  return (dispatch, getState) => {
    dispatch(actions.clear(stateKey));

    const filter = getFilter(getState());
    return dispatch(fetchSummary(filter));
  };
}
