import { createSelector } from 'reselect';

import createFilter from '../filter';

import { taxIdMap } from '../species';

const getFilterState = ({ home }) => home.filter;

export const filters = [
  { key: 'searchRegExp',
    matches(collection, regexp) {
      return regexp ?
        regexp.test(collection.title) || regexp.test(collection.description) :
        true;
    },
    getValue: createSelector(
      getFilterState,
      filter => (filter.searchRegExp ? filter.searchRegExp.source : '')
    ),
  },
  { key: 'species',
    matches(collection, value) {
      return collection.species === value;
    },
    onLocationChange(state, { query }) {
      if (!query.species) return null;
      if (taxIdMap.has(query.species)) return query.species;
      return state;
    },
  },
];

export const { actions, reducer, selectors } =
  createFilter({
    name: 'home',
    filters,
    getFilterState,
  });
