import { stateKey } from './index';

import { actions } from '../../filter';
import { fetchSummary } from '../actions';

import { getFilter } from './selectors';

import { checkStale } from '../../actions';

export function updateFilterValue(filterMap) {
  return actions.update(stateKey, filterMap);
}

export function applyFilter() {
  return checkStale(fetchSummary, getFilter);
}

export function updateFilter(query, updateQueryString = true) {
  return (dispatch) => {
    if (updateQueryString) {
      dispatch(updateFilterValue(query));
    } else {
      dispatch(actions.setFilter(stateKey, query));
    }
    dispatch(applyFilter());
  };
}

export function clearFilter() {
  return (dispatch, getState) => {
    dispatch(actions.clear(stateKey));

    const filter = getFilter(getState());
    dispatch(fetchSummary(filter));
  };
}

export const COLLECTIONS_FILTER_OPENED = 'COLLECTIONS_FILTER_OPENED';

export function toggleFilter() {
  return {
    type: COLLECTIONS_FILTER_OPENED,
  };
}
