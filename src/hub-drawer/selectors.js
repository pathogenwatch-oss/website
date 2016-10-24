import { createSelector } from 'reselect';

import * as hub from '../hub/selectors';
import { getNumberOfVisibleFastas, getVisibleFastas }
  from '../hub-filter/selectors';

import { isSupported } from '../species';

export const getVisibleSpecies = createSelector(
  getVisibleFastas,
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
  state => state.hub.loading,
  hub.isUploading,
  isSupportedSpeciesSelected,
  (loading, uploading, supportSpeciesSelected) =>
    console.log(!loading, !uploading, supportSpeciesSelected) ||
    !loading && !uploading && supportSpeciesSelected
);

export const getCollectionSummary = createSelector(
  getVisibleSpecies,
  getNumberOfVisibleFastas,
  ({ supported }, numAssemblies) => ({
    numAssemblies,
    speciesId: console.log(supported) || Array.from(supported)[0],
  })
);

export const getCollectionMetadata = state => state.hub.collectionMetadata;
