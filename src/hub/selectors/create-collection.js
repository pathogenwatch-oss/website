import { createSelector } from 'reselect';

import * as selectors from '../selectors';

import { isSupported } from '../../species';

export const getVisibleSupportedSpecies = createSelector(
  selectors.getVisibleFastas,
  fastas => fastas.reduce((memo, fasta) => {
    if (!isSupported(fasta)) return memo;
    memo.add(fasta.speciesId);
    return memo;
  }, new Set())
);

export const isSupportedSpeciesSelected = createSelector(
  getVisibleSupportedSpecies,
  species => species.size === 1
);

export const canCreateCollection = createSelector(
  ({ hub }) => hub.loading,
  selectors.isUploading,
  isSupportedSpeciesSelected,
  (loading, uploading, supportSpeciesSelected) =>
    !loading && !uploading && supportSpeciesSelected
);

export const getCollectionSummary = createSelector(
  getVisibleSupportedSpecies,
  selectors.getNumberOfVisibleFastas,
  (speciesIds, numAssemblies) => ({
    numAssemblies,
    speciesId: Array.from(speciesIds)[0],
  })
);

export const getCollectionMetadata = ({ hub }) => hub.collectionMetadata;
