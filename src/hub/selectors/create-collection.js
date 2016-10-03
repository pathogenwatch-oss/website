import { createSelector } from 'reselect';

import * as selectors from '../selectors';

import { isSupported } from '../../species';

export const isSupportedSpeciesSelected = createSelector(
  selectors.getVisibleFastas,
  fastas => {
    for (const fasta of fastas) {
      if (!isSupported(fasta)) return false;
    }
    return fastas.length > 0;
  }
);

export const canCreateCollection = createSelector(
  selectors.isUploading,
  isSupportedSpeciesSelected,
  (uploading, supportSpeciesSelected) => !uploading && supportSpeciesSelected
);

export const getCollectionSummary = createSelector(
  selectors.getMetadataFilters,
  selectors.getNumberOfVisibleFastas,
  ({ wgsaSpecies }, numAssemblies) => ({
    numAssemblies,
    species: wgsaSpecies.filter(_ => _.active)[0],
  })
);
