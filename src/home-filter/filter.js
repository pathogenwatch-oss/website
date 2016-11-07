import { createSelector } from 'reselect';

import { HOME } from '../app/stateKeys/filters';
export const stateKey = HOME;

import { getFilter } from './selectors';

export const filters = [
  { key: 'searchRegExp',
    matches(collection, regexp) {
      return regexp ?
        regexp.test(collection.title) || regexp.test(collection.description) :
        true;
    },
    getValue: createSelector(
      getFilter,
      filter => (filter.searchRegExp ? filter.searchRegExp.source : '')
    ),
  },
  { key: 'species',
    queryKey: 'species',
    matches(collection, value) {
      return collection.species === value;
    },
  },
];
