import { createSelector } from 'reselect';

import { getViewer } from '../selectors';
import { getActiveGenomes } from '../genomes/selectors';
import { getColourGetter } from '../table/selectors';

export const getColouredActiveGenomes = createSelector(
  getActiveGenomes,
  getColourGetter,
  (items, colourGetter) =>
    items.map((genome) => ({
      genome,
      colour: colourGetter(genome),
    }))
);

export const getGenomeSummary = createSelector(
  getActiveGenomes,
  getColourGetter,
  (activeGenomes, colourGetter) => Array.from(
    activeGenomes.reduce((memo, genome) => {
      const colour = colourGetter(genome);
      const genomes = memo.get(colour) || [];
      genomes.push(genome);
      return memo.set(colour, genomes);
    }, new Map()).entries()
  )
);

const getSummary = state => getViewer(state).summary;

export const getIsSummaryExpanded = (state) => getSummary(state).isExpanded;
