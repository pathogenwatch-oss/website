import { createSelector } from 'reselect';

import { getViewer } from '../selectors';
import { getActiveGenomes } from '../selectors/active';
import { getGenomeStyles } from '../selectors/styles';

export const getColouredActiveGenomes = createSelector(
  getActiveGenomes,
  getGenomeStyles,
  (items, genomeStyles) =>
    items.map((genome) => ({
      genome,
      colour: genomeStyles[genome.id].colour,
    }))
);

export const getGenomeSummary = createSelector(
  getActiveGenomes,
  getGenomeStyles,
  (activeGenomes, genomeStyles) => Array.from(
    activeGenomes
      .reduce((memo, genome) => {
        if (genome.id in genomeStyles) {
          const colour = genomeStyles[genome.id].colour;
          const genomes = memo.get(colour) || [];
          genomes.push(genome);
          return memo.set(colour, genomes);
        }
        return memo;

      }, new Map()).entries()
  )
);

const getSummary = state => getViewer(state).summary;

export const getIsSummaryExpanded = (state) => getSummary(state).isExpanded;
