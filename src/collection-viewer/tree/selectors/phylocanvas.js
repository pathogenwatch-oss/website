import { createSelector } from 'reselect';
import parse from '@cgps/phylocanvas/utils/parse';

import { getTreeState, getTreeStateKey } from './index';
import { getNodeStyles } from './styles';
import { getTrees, getVisibleTree } from './entities';
import { getHighlightedIdArray } from '../../highlight/selectors';
import { getGenomes } from '../../genomes/selectors';

import { topLevelTrees } from '../constants';
import { POPULATION, COLLECTION } from '~/app/stateKeys/tree';

export const getHighlightedNodeIds = createSelector(
  getTreeStateKey,
  getHighlightedIdArray,
  getGenomes,
  (tree, highlightedIds, genomes) => {
    if (tree === POPULATION) {
      const ids = new Set();
      for (const id of highlightedIds) {
        if (genomes[id].analysis) {
          ids.add(genomes[id].analysis.core.fp.reference);
        }
      }
      return Array.from(ids);
    }
    return highlightedIds;
  }
);

const scaleBarProps = {
  digits: 0,
  fontSize: 13,
  position: { left: 8, bottom: 16 },
};

const populationLeafNodeStyle = {
  shape: 'triangle',
};

export const getPhylocanvasState = createSelector(
  getVisibleTree,
  getNodeStyles,
  getHighlightedNodeIds,
  state => getTreeState(state).size,
  ({ phylocanvas, name }, nodeStyles, highlightedIds, size) => ({
    ...phylocanvas,
    leafNodeStyle: name === POPULATION ? populationLeafNodeStyle : phylocanvas.leafNodeStyle,
    renderLeafLabels: name === POPULATION || phylocanvas.renderLeafLabels,
    scalebar: scaleBarProps,
    selectedIds: highlightedIds,
    size: size || phylocanvas.size,
    styles: nodeStyles,
  })
);

const getLeafNodeOrder = source => {
  if (!source) return [];
  const parsed = parse(source);
  return parsed.leafNodes.map(_ => _.id);
};

const getCollectionTreeOrder = createSelector(
  state => getTrees(state)[COLLECTION].phylocanvas.source,
  getLeafNodeOrder
);

export const getTreeOrder = createSelector(
  getTreeStateKey,
  getCollectionTreeOrder,
  state => getVisibleTree(state).phylocanvas.source,
  (stateKey, collectionTreeOrder, source) => {
    if (topLevelTrees.has(stateKey)) {
      return collectionTreeOrder;
    }
    return getLeafNodeOrder(source);
  }
);
