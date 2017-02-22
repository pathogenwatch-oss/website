import { updateQueryString, clearQueryString } from '../location';
import * as actions from './actions';

export function update(stateKey, key, newValue) {
  return dispatch => {
    dispatch(actions.updateFilter(stateKey, key, newValue));
    if (key !== 'prefilter') {
      updateQueryString(key, newValue);
    }
  };
}

export function clear(stateKey, filters) {
  return dispatch => {
    dispatch(actions.clearFilter(stateKey));
    clearQueryString(filters.map(_ => _.queryKey));
  };
}

export { isActive } from './selectors';
export LocationListener from './LocationListener.react';
export * as actions from './actions';
export * as selectors from './selectors';
export reducer from './reducer';
