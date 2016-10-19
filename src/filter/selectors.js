import { createSelector } from 'reselect';

export default (filters, getFilter) => {
  const isActive = createSelector(
    getFilter,
    state => filters.some(({ key }) => state[key]),
  );

  return {
    getFilter,
    isActive,
    getIncludedItems: getItems => createSelector(
      isActive,
      getFilter,
      getItems,
      (active, state, items) => {
        if (!active) return items;
        return items.filter(item =>
          filters.every(filter => {
            const value = state[filter.key];
            return (
              value ? filter.matches(item, value) : true
            );
          })
        );
      }
    ),
  };
};
