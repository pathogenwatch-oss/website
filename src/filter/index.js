import { updateQueryString, clearQueryString } from '../location';
import * as actions from './actions';

export function update(stateKey, { queryKey, key }, newValue) {
  return dispatch =>
    (queryKey ?
      updateQueryString(queryKey, newValue) :
      dispatch(actions.updateFilter(stateKey, key, newValue))
    );
}

export function clear(stateKey, filters) {
  return dispatch => {
    dispatch(actions.clearFilter(stateKey));
    clearQueryString(filters.map(_ => _.queryKey));
  };
}

export { isActive } from './selectors';

export LocationListener from './LocationListener.react';

export * as selectors from './selectors';
export default from './reducer';
