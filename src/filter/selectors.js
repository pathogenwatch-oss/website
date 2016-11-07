import { createSelector } from 'reselect';

export function getFilter(state, { stateKey }) {
  return state.filter[stateKey] || {};
}

export const isActive = createSelector(
  getFilter,
  filter => Object.keys(filter).some(key => filter[key]),
);

export const getFilteredItems = createSelector(
  isActive,
  getFilter,
  (_, props) => props,
  (active, filterState, { items, filters }) => {
    if (!active) return items;
    return items.filter(item =>
      filters.every(filter => {
        const value = filterState[filter.key];
        return (
          value ? filter.matches(item, value) : true
        );
      })
    );
  }
);
