import { stateKey } from './filter';

import { update } from '../../filter';
import { fetchGenomes, fetchSummary } from '../actions';

import { getFilter } from './selectors';

export function filterByArea(path) {
  return update(stateKey, { key: 'area' }, path);
}

export function updateFilter(key, value) {
  return (dispatch, getState) => {
    dispatch(update(stateKey, key, value));

    const filter = getFilter(getState());
    console.log(filter);
    if (key === 'prefilter') {
      dispatch(fetchSummary(filter));
    }
    dispatch(fetchGenomes(filter));
  };
}
