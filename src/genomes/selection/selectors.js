import { createSelector } from 'reselect';

import { isSupported } from '../../species';

export const getSelectedGenomes = ({ genomes }) => genomes.selection;

export const getSelectedGenomeList = createSelector(
  getSelectedGenomes,
  selection => Object.keys(selection).map(key => selection[key])
);

export const getSelectedGenomeSummary = createSelector(
  getSelectedGenomeList,
  selectedGenomes => selectedGenomes.reduce((memo, genome) => {
    if (isSupported(genome)) {
      memo[genome.speciesId] = (memo[genome.speciesId] || 0) + 1;
    }
    return memo;
  }, {})
);
