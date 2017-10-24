import { createSelector } from 'reselect';

export function getFilter(state, { stateKey }) {
  return state.filters[stateKey] || {};
}

export const isActive = createSelector(
  getFilter,
  filter => Object.keys(filter).
    some(key => key !== 'prefilter' && filter[key]),
);
