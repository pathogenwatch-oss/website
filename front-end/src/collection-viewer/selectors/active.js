import { createSelector } from 'reselect';

import { getGenomes } from '../genomes/selectors';
import { getHighlightedIds } from '../highlight/selectors';
import { getFilteredGenomeIds } from '../filter/selectors';
import { getTreeOrder } from '../tree/selectors/phylocanvas';
import { isClusterView } from '../selectors';

export const getActiveGenomeIds = createSelector(
  getHighlightedIds,
  getFilteredGenomeIds,
  (highlighted, visible) => Array.from(highlighted.size ? highlighted : visible)
);

const getOrder = state => {
  if (isClusterView(state)) {
    return undefined;
  }
  return getTreeOrder(state);
};

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  getOrder,
  (genomes, activeIds, order) => {
    if (!order || !order.length) {
      return activeIds.map(id => genomes[id]);
    }
    const sorted = [];
    for (const id of order) {
      if (activeIds.includes(id)) {
        sorted.push(genomes[id]);
      }
    }
    return sorted;
  }
);
