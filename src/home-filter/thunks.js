import { actions, selectors } from '../filter';

import { stateKey, filters } from './filter';

export function onQueryChange(query) {
  return (dispatch, getState) => {
    const filterState = selectors.getFilter(getState(), { stateKey });
    filters.forEach(({ queryKey, key }) => {
      if (!queryKey) return;
      if (query[queryKey] === filterState[key]) return;
      dispatch(actions.updateFilter(stateKey, key, query[queryKey]));
    });
  };
}
