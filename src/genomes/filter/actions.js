import { stateKey } from './index';

import { actions } from '../../filter';
import { fetchGenomes, fetchSummary } from '../actions';

import { getFilter } from './selectors';

export function filterByArea(path) {
  return actions.update(stateKey, { key: 'area' }, path);
}

export function updateFilter(query, updateQueryString = true) {
  return (dispatch, getState) => {
    const previous = getFilter(getState());
    const update = updateQueryString ? actions.update : actions.updateFilter;
    dispatch(update(stateKey, query));

    const currentFilter = getFilter(getState());
    if (previous.prefilter !== query.prefilter) {
      dispatch(fetchSummary(currentFilter));
    }
    dispatch(fetchGenomes(currentFilter));
  };
}

export function clearFilter() {
  return (dispatch, getState) => {
    dispatch(actions.clear(stateKey));

    const filter = getFilter(getState());
    dispatch(fetchGenomes(filter));
  };
}
