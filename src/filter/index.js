import { updateQueryString, clearQueryString } from '../location';
import * as actions from './actions';

export function update(stateKey, { queryKey, key }, newValue) {
  return dispatch => {
    dispatch(actions.updateFilter(stateKey, key, newValue));
    if (queryKey) updateQueryString(queryKey, newValue);
  };
}

export function clear(stateKey, filters) {
  return dispatch => {
    dispatch(actions.clearFilter(stateKey));
    clearQueryString(filters.map(_ => _.queryKey));
  };
}

export { isActive } from './selectors';

export * as actions from './actions';
export * as selectors from './selectors';
export default from './reducer';
