import { createSelector } from 'reselect';

import * as genomes from '../selectors';
import { getNumberOfVisibleGenomes, getVisibleGenomes }
  from '../filter/selectors';

import { isSupported } from '../../species';

export const getVisibleSpecies = createSelector(
  getVisibleGenomes,
  genomes => genomes.reduce((memo, genome) => {
    if (isSupported(genome)) {
      memo.supported.add(genome.speciesId);
    } else {
      memo.unsupported.add(genome.speciesKey); // no species id for unsupported
    }
    return memo;
  }, { supported: new Set(), unsupported: new Set() })
);

export const isSupportedSpeciesSelected = createSelector(
  getVisibleSpecies,
  species => species.unsupported.size === 0 && species.supported.size === 1
);

export const canCreateCollection = createSelector(
  state => state.genomes.loading,
  genomes.isUploading,
  isSupportedSpeciesSelected,
  (loading, uploading, supportSpeciesSelected) =>
    !loading && !uploading && supportSpeciesSelected
);

export const getCollectionSummary = createSelector(
  getVisibleSpecies,
  getNumberOfVisibleGenomes,
  ({ supported }, numGenomes) => ({
    numGenomes,
    speciesId: Array.from(supported)[0],
  })
);

export const getCollectionMetadata = state => state.genomes.collectionMetadata;
