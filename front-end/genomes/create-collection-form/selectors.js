import { createSelector } from 'reselect';

import { getSelectedGenomeList } from '../selection/selectors';
import { isWaiting } from '../selectors';

export const getSelectedGenomeSummary = createSelector(
  getSelectedGenomeList,
  (selectedGenomes) => selectedGenomes.reduce((memo, genome) => {
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
    const organismName = Object.values(summary)[0][0].organismName;
    const organismLabel = Object.values(summary)[0][0].organismLabel;
    const numGenomes = summary[organismId].length;

    return { organismId, organismName, organismLabel, numGenomes };
  }
);

export const getCollectionSummaryOrganismName = createSelector(
  getCollectionSummary,
  summary => summary.organismName
);
export const getCollectionSummaryOrganismId = createSelector(
  getCollectionSummary,
  summary => summary.organismId
);

export const getCollectionMetadata = state => state.genomes.collectionMetadata;
