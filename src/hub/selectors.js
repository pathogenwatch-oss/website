import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { metadataFilters } from './utils/filter';
import { isSupported } from '../species';

export const getFastas = ({ entities }) => entities.fastas;

export const getFilter = ({ hub }) => hub.filter;

export const isFilterActive = createSelector(
  getFilter,
  ({ searchText = '', ...metadata }) => {
    if (searchText.length > 0) return true;

    for (const { key } of metadataFilters) {
      if (metadata[key]) return true;
    }

    return false;
  }
);

export const getFastasAsList = createSelector(
  getFastas,
  fastas => Object.keys(fastas).map(key => fastas[key])
);

export const getFastaKeys = createSelector(
  getFastasAsList,
  fastas => fastas.map(_ => _.name)
);

export const getTotalFastas = (state) => getFastasAsList(state).length;

export const getOrderedFastas =
  createSelector(
    getFastas,
    fastas => sortBy(fastas, [ 'name' ])
  );

export const getVisibleFastas = createSelector(
  isFilterActive,
  getFilter,
  getOrderedFastas,
  (isActive, { searchText = '', ...metadata }, fastas) => {
    if (isActive) {
      const regexp = new RegExp(searchText, 'i');
      return fastas.filter(fasta =>
        (searchText.length ? regexp.test(fasta.name) : true) &&
        metadataFilters.every(filter => {
          const value = metadata[filter.key];
          return (
            value ? filter.matches(fasta, value) : true
          );
        })
      );
    }
    return fastas;
  }
);

export const isSupportedSpeciesSelected = createSelector(
  getVisibleFastas,
  fastas => {
    for (const fasta of fastas) {
      if (!isSupported(fasta)) return false;
    }
    return fastas.length > 0;
  }
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
  getFilter,
  (fastas, filterState) => {
    const wgsaSpeciesMap = new Map();
    const otherSpeciesMap = new Map();
    const countryMap = new Map();

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
    }

    return {
      wgsaSpecies: getSummary(wgsaSpeciesMap),
      otherSpecies: getSummary(otherSpeciesMap),
      country: getSummary(countryMap),
    };
  }
);
