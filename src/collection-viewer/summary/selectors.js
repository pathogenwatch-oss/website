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
      .filter(genome => Object.keys(genomeStyles).includes(genome.id))
      .reduce((memo, genome) => {
        const colour = genomeStyles[genome.id].colour;
        const genomes = memo.get(colour) || [];
        genomes.push(genome);
        return memo.set(colour, genomes);
      }, new Map()).entries()
  )
);

const getSummary = state => getViewer(state).summary;

export const getIsSummaryExpanded = (state) => getSummary(state).isExpanded;
