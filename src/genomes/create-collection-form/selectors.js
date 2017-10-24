import { createSelector } from 'reselect';

import { getSelectedSupportedGenomesList } from '../selection/selectors';
import { isWaiting } from '../selectors';

export const getSelectedGenomeSummary = createSelector(
  getSelectedSupportedGenomesList,
  selectedGenomes => selectedGenomes.reduce((memo, genome) => {
    memo[genome.organismId] = memo[genome.organismId] || [];
    memo[genome.organismId].push(genome);
    return memo;
  }, {})
);

export const canCreateCollection = createSelector(
  isWaiting,
  getSelectedGenomeSummary,
  (waiting, selectedSummary) =>
    !waiting && Object.keys(selectedSummary).length === 1
);

export const getCollectionSummary = createSelector(
  getSelectedGenomeSummary,
  (summary) => {
    const organismId = Object.keys(summary)[0];
    const numGenomes = summary[organismId].length;

    return { organismId, numGenomes };
  }
);

export const getCollectionMetadata = state => state.genomes.collectionMetadata;
