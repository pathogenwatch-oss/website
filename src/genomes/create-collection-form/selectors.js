import { createSelector } from 'reselect';

import { getSelectedGenomeList } from '../selection/selectors';
import { isUploading } from '../uploads/selectors';
import { isWaiting } from '../selectors';

import { isSupported } from '../../species';

export const getVisibleSpecies = createSelector(
  getSelectedGenomeList,
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
  isWaiting,
  isUploading,
  isSupportedSpeciesSelected,
  (waiting, uploading, supportSpeciesSelected) =>
    !waiting && !uploading && supportSpeciesSelected
);

export const getCollectionSummary = createSelector(
  getVisibleSpecies,
  getSelectedGenomeList,
  ({ supported }, genomes) => ({
    numGenomes: genomes.length,
    speciesId: Array.from(supported)[0],
  })
);

export const getCollectionMetadata = state => state.genomes.collectionMetadata;
