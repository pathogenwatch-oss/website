import { stateKey } from './index';

import { actions } from '../../filter';
import { fetchCollections, fetchSummary } from '../actions';

import { getFilter } from './selectors';

export function updateFilter(query, updateQueryString = true) {
  return (dispatch, getState) => {
    const previous = getFilter(getState());
    const update = updateQueryString ? actions.update : actions.setFilter;
    dispatch(update(stateKey, query));

    const currentFilter = getFilter(getState());
    if (previous.prefilter !== query.prefilter) {
      dispatch(fetchSummary(currentFilter));
    }
    dispatch(fetchCollections(currentFilter));
  };
}

export function clearFilter() {
  return (dispatch, getState) => {
    dispatch(actions.clear(stateKey));

    const filter = getFilter(getState());
    dispatch(fetchCollections(filter));
  };
}

export const COLLECTIONS_FILTER_OPENED = 'COLLECTIONS_FILTER_OPENED';

export function toggleFilter() {
  return {
    type: COLLECTIONS_FILTER_OPENED,
  };
}
