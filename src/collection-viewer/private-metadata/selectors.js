import { createSelector } from 'reselect';
import { getGenomeList } from '../selectors';

const getMetadataState = state => state.viewer.metadata;

export const getPrivateMetadata = state => getMetadataState(state).entities;
export const showingAddMetadata = state => getMetadataState(state).showing;

const getGenomes = state => (getGenomeList ? getGenomeList(state) : []);

export const hasPrivateMetadata = createSelector(
  getPrivateMetadata,
  getGenomes,
  (metadata, genomes) => {
    for (const genome of genomes) {
      if (genome.name in metadata) return true;
    }
    return false;
  }
);

