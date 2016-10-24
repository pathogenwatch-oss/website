import { createSelector } from 'reselect';

import * as selectors from '../selectors';

import { isSupported } from '../../species';

export const getVisibleSpecies = createSelector(
  selectors.getVisibleFastas,
  fastas => fastas.reduce((memo, fasta) => {
    if (isSupported(fasta)) {
      memo.supported.add(fasta.speciesId);
    } else {
      memo.unsupported.add(fasta.speciesKey); // no species id for unsupported
    }
    return memo;
  }, { supported: new Set(), unsupported: new Set() })
);

export const isSupportedSpeciesSelected = createSelector(
  getVisibleSpecies,
  species => species.unsupported.size === 0 && species.supported.size === 1
);

export const canCreateCollection = createSelector(
  ({ hub }) => hub.loading,
  selectors.isUploading,
  isSupportedSpeciesSelected,
  (loading, uploading, supportSpeciesSelected) =>
    !loading && !uploading && supportSpeciesSelected
);

export const getCollectionSummary = createSelector(
  getVisibleSpecies,
  selectors.getNumberOfVisibleFastas,
  ({ supported }, numAssemblies) => ({
    numAssemblies,
    speciesId: Array.from(supported)[0],
  })
);

export const getCollectionMetadata = ({ hub }) => hub.collectionMetadata;
