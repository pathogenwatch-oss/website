import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { getCollections } from '../selectors';
import { selectors as filter } from '../../filter';

import { taxIdMap } from '../../species';

import { stateKey, filters } from './filter';

export const getFilter = state => filter.getFilter(state, { stateKey });

export const getSearchText = createSelector(
  getFilter,
  ({ searchRegExp }) => (searchRegExp ? searchRegExp.source : ''),
);

function incrementSummary(map, key, newEntry) {
  const summary = map.get(key) || {
    ...newEntry,
    count: 0,
  };
  summary.count++;
  map.set(key, summary);
}

function getSummary(map) {
  return sortBy(Array.from(map.values()), [ 'name' ]);
}

export const getFilterSummary = createSelector(
  getCollections,
  getFilter,
  (collections, filterState) => {
    const speciesMap = new Map();
    const ownerMap = new Map();

    for (const { speciesId, owner } of collections) {
      incrementSummary(speciesMap, speciesId, {
        name: speciesId,
        label: taxIdMap.get(speciesId).formattedShortName,
        active: speciesId === filterState.speciesId,
      });

      if (owner === 'me') {
        incrementSummary(ownerMap, 'me', {
          name: 'me',
          label: 'Me',
          active: filterState.owner === 'me',
        });
      } else {
        incrementSummary(ownerMap, 'other', {
          name: 'other',
          label: 'Other',
          active: filterState.owner === 'other',
        });
      }
    }

    return {
      species: getSummary(speciesMap),
      owner: getSummary(ownerMap),
    };
  }
);

export const getVisibleCollections = state =>
  filter.getFilteredItems(state, {
    stateKey,
    filters,
    items: getCollections(state),
  });
