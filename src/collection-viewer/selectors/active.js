import { createSelector } from 'reselect';

import { getGenomes } from '../genomes/selectors';
import { getHighlightedIds } from '../highlight/selectors';
import { getFilteredGenomeIds } from '../filter/selectors';

export const getActiveGenomeIds = createSelector(
  getHighlightedIds,
  getFilteredGenomeIds,
  (highlighted, visible) => Array.from(highlighted.size ? highlighted : visible)
);

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  (genomes, ids) => ids.map(id => genomes[id])
);
