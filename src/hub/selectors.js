import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from './filter';

import { isSupported } from '../species';

export const getFastas = ({ entities }) => entities.fastas;

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
    fastas => sortBy(fastas, [
      ({ speciesKey, uploadAttempted, error }) => {
        if (uploadAttempted && !speciesKey) return 0;
        if (error) return 1;
        return 2;
      },
      'name',
    ])
  );

export const getUploads = ({ hub }) => hub.uploads;
export const getUploadQueue = createSelector(
  getUploads,
  uploads => uploads.queue,
);
export const getUploading = createSelector(
  getUploads,
  uploads => uploads.uploading,
);
export const getBatchSize = state => getUploads(state).batchSize;

export const getNumRemainingUploads = createSelector(
  getUploadQueue,
  getUploading,
  (queue, uploading) => queue.length + uploading.size,
);

export const isUploading = createSelector(
  getNumRemainingUploads,
  numRemaining => numRemaining > 0,
);

export const getNumCompletedUploads = createSelector(
  getBatchSize,
  getNumRemainingUploads,
  (batchSize, numRemaining) => batchSize - numRemaining,
);

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
