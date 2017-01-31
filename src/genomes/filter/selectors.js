import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { getOrderedGenomes } from '../selectors';
import { selectors as filter } from '../../filter';

import { stateKey, filters } from './filter';
import { getCountryName } from '../../utils/country';

import { isSupported } from '../../species';

export const getFilter = state => filter.getFilter(state, { stateKey });

export const getSearchText = createSelector(
  getFilter,
  ({ searchRegExp }) => (searchRegExp ? searchRegExp.source : ''),
);

export const getVisibleGenomes = state =>
  filter.getFilteredItems(state, {
    filters,
    stateKey,
    items: getOrderedGenomes(state),
  });

export const getNumberOfVisibleGenomes = createSelector(
  getVisibleGenomes,
  genomes => genomes.length,
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
  getOrderedGenomes,
  filter.getFilter,
  (genomes, filterState) => {
    const wgsaSpeciesMap = new Map();
    const otherSpeciesMap = new Map();
    const countryMap = new Map();
    const yearSet = new Set();

    for (const genome of genomes) {
      if (genome.speciesKey) {
        const speciesMap =
          isSupported(genome) ? wgsaSpeciesMap : otherSpeciesMap;
        incrementSummary(speciesMap, genome.speciesKey, {
          name: genome.speciesKey,
          label: genome.speciesLabel,
          active: genome.speciesKey === filterState.speciesKey,
        });
      }

      if (genome.country) {
        incrementSummary(countryMap, genome.country, {
          name: genome.country,
          label: getCountryName(genome.country),
          active: genome.country === filterState.country,
        });
      }

      if (genome.date) {
        yearSet.add(genome.date.getFullYear());
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
