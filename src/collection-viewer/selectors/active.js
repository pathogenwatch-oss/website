import { createSelector } from 'reselect';

import { getGenomes } from '../genomes/selectors';
import { getHighlightedIds } from '../highlight/selectors';
import { getFilteredGenomeIds } from '../filter/selectors';
import { getTreeOrder } from '../tree/selectors/entities';

export const getActiveGenomeIds = createSelector(
  getHighlightedIds,
  getFilteredGenomeIds,
  (highlighted, visible) => Array.from(highlighted.size ? highlighted : visible)
);

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  getTreeOrder,
  (genomes, active, order) => {
    const sorted = [];
    for (const id of order) {
      if (active.includes(id)) {
        sorted.push(genomes[id]);
      }
    }
    return sorted;
  }
);
