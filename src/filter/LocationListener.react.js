import React from 'react';

import { LocationListener } from '../location';

import { getFilter } from './selectors';
import { updateFilter } from './actions';

function onQueryChange(query, stateKey, filters) {
  return (dispatch, getState) => {
    const filterState = getFilter(getState(), { stateKey });
    filters.forEach(({ queryKey, key }) => {
      if (!queryKey) return;
      if (query[queryKey] === filterState[key]) return;
      dispatch(updateFilter(stateKey, key, query[queryKey]));
    });
  };
}

export default ({ stateKey, filters }) => (
  <LocationListener update={query => onQueryChange(query, stateKey, filters)} />
);
