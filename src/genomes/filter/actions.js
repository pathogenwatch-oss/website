import { stateKey } from './index';

import { actions } from '../../filter';
import { fetchGenomes, fetchSummary } from '../actions';

import { getFilter } from './selectors';

export function filterByArea(path) {
  return actions.update(stateKey, { key: 'area' }, path);
}

export function updateFilter(query) {
  return (dispatch, getState) => {
    dispatch(actions.update(stateKey, query));

    const filter = getFilter(getState());
    if (filter.prefilter !== query.prefilter) {
      dispatch(fetchSummary(filter));
    }
    dispatch(fetchGenomes(filter));
  };
}

export function clearFilter() {
  return (dispatch, getState) => {
    dispatch(actions.clear(stateKey));

    const filter = getFilter(getState());
    dispatch(fetchGenomes(filter));
  };
}
