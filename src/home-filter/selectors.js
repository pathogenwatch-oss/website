import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { getReferenceCollections } from '../home/selectors';
import { selectors as filter } from './filter';

import { taxIdMap } from '../species';

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
  getReferenceCollections,
  filter.getFilter,
  (collections, filterState) => {
    const speciesMap = new Map();

    for (const { species } of collections) {
      incrementSummary(speciesMap, species, {
        name: species,
        label: taxIdMap.get(species).formattedShortName,
        active: species === filterState.species,
      });
    }

    return {
      species: getSummary(speciesMap),
    };
  }
);
