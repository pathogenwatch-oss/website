import { createSelector } from 'reselect';

import { getFilter } from '../selectors';

export const getSort = createSelector(
  getFilter,
  filter => filter.sort
);

export const getSortActive = (state, props) => {
  const sort = getSort(state, props);
  return sort && sort.indexOf(props.sortKey) === 0;
};

export const getSortOrder = createSelector(
  getSort,
  (sort = '') => sort.slice(-1) !== '-'
);
