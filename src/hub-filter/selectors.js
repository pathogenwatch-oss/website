import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { getOrderedFastas, getTotalFastas } from '../hub/selectors';
import { selectors as filter } from './filter';

import { isSupported } from '../species';

export const isFilterActive = state => {
  if (getTotalFastas(state) === 0) return false;
  return filter.isActive(state);
};

export const getVisibleFastas = filter.getIncludedItems(getOrderedFastas);

export const getNumberOfVisibleFastas = createSelector(
  getVisibleFastas,
  fastas => fastas.length,
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

export const getMetadataFilters = createSelector(
  getOrderedFastas,
  filter.getFilter,
  (fastas, filterState) => {
    const wgsaSpeciesMap = new Map();
    const otherSpeciesMap = new Map();
    const countryMap = new Map();
    const yearSet = new Set();

    for (const fasta of fastas) {
      if (fasta.speciesKey) {
        const speciesMap =
          isSupported(fasta) ? wgsaSpeciesMap : otherSpeciesMap;
        incrementSummary(speciesMap, fasta.speciesKey, {
          name: fasta.speciesKey,
          label: fasta.speciesLabel,
          active: fasta.speciesKey === filterState.speciesKey,
        });
      }

      if (fasta.country) {
        const { name } = fasta.country;
        incrementSummary(countryMap, name, {
          name,
          active: name === filterState.country,
        });
      }

      if (fasta.date) {
        yearSet.add(fasta.date.getFullYear());
      }
    }

    return {
      wgsaSpecies: getSummary(wgsaSpeciesMap),
      otherSpecies: getSummary(otherSpeciesMap),
      country: getSummary(countryMap),
      date: {
        min: filterState.minDate || { year: '', month: '' },
        max: filterState.maxDate || { year: '', month: '' },
        years: Array.from(yearSet),
      },
    };
  }
);

export const getSearchText = createSelector(
  filter.getFilter,
  ({ searchRegExp }) => (searchRegExp ? searchRegExp.source : ''),
);
