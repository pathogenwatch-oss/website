import { createSelector } from 'reselect';
import { getGenomeList } from '../selectors';

export const getPrivateMetadata = state => state.viewer.entities.metadata;

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

