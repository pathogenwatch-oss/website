import { stateKey } from './filter';

import { actions } from '../../filter';
import { fetchGenomes, fetchSummary } from '../actions';

import { getFilter } from './selectors';

export function filterByArea(path) {
  return actions.update(stateKey, { key: 'area' }, path);
}

export function updateFilter(key, value) {
  return (dispatch, getState) => {
    dispatch(actions.update(stateKey, key, value));

    const filter = getFilter(getState());
    if (key === 'prefilter') {
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
