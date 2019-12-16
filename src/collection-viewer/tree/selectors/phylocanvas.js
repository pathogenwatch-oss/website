import { createSelector } from 'reselect';
import parse from '@cgps/phylocanvas/utils/parse';
import rotateSubtree from '@cgps/phylocanvas/utils/rotateSubtree';

import { getTreeState, getTreeStateKey, getTitles, getVisibleLibMRTree, getLibMRTrees } from './index';
import { getNodeStyles } from './styles';
import { getTrees, getVisibleTree } from './entities';
import { getHighlightedIdArray } from '../../highlight/selectors';
import { getGenomes } from '../../genomes/selectors';
import { getCollection } from '../../selectors';

import Organisms from '~/organisms';

import { topLevelTrees, titles } from '../constants';
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

export const getFilenamePrefix = createSelector(
  getTreeStateKey,
  getTitles,
  state => getCollection(state).uuid,
  (tree, subtreeTitles, collectionId) => {
    const title = tree in titles ? titles[tree].toLowerCase() : subtreeTitles[tree];
    return `pathogenwatch-${Organisms.nickname}-${collectionId}${title ? `-${title}` : ''}-tree`;
  }
);

export const getFilenames = createSelector(
  getFilenamePrefix,
  (prefix) => ({
    image: `${prefix}.png`,
    leafLabels: `${prefix}-labels.txt`,
    newick: `${prefix}.nwk`,
  })
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
  getVisibleLibMRTree,
  getNodeStyles,
  getHighlightedNodeIds,
  ({ name, newick }, { phylocanvas }, nodeStyles, highlightedIds) => ({
    ...phylocanvas,
    leafNodeStyle: name === POPULATION ? populationLeafNodeStyle : phylocanvas.leafNodeStyle,
    renderLeafLabels: name === POPULATION || phylocanvas.renderLeafLabels,
    scalebar: scaleBarProps,
    selectedIds: highlightedIds,
    source: phylocanvas.source || newick,
    styles: nodeStyles,
  })
);

const getLeafNodeOrder = (nodes, rotatedIds = []) => {
  if (!nodes) return [];

  for (const id of rotatedIds) {
    const node = nodes.nodeById[id];
    rotateSubtree(null, nodes, node);
  }

  const order = [];
  for (const node of nodes.preorderTraversal) {
    if (node.isLeaf) {
      order.push(node.id);
    }
  }
  return order;
};

const getCollectionPhylocanvasState = state => {
  const libmrStates = getLibMRTrees(state);
  if (COLLECTION in libmrStates) {
    return libmrStates[COLLECTION].phylocanvas;
  }
  return {};
};

const getCollectionNodes = createSelector(
  state => getCollectionPhylocanvasState(state).source,
  state => getTrees(state)[COLLECTION].newick,
  (source, newick) => parse(source || newick)
);

const getCollectionTreeOrder = createSelector(
  getCollectionNodes,
  state => getCollectionPhylocanvasState(state).rotatedIds,
  (nodes, rotatedIds) => getLeafNodeOrder(nodes, rotatedIds)
);

const getVisibleTreeNodes = createSelector(
  state => getVisibleLibMRTree(state).phylocanvas.source,
  source => (source ? parse(source) : null)
);

export const getTreeOrder = createSelector(
  getTreeStateKey,
  getCollectionTreeOrder,
  getVisibleTreeNodes,
  state => getVisibleLibMRTree(state).phylocanvas.rotatedIds,
  (stateKey, collectionTreeOrder, nodes, rotatedIds) => {
    if (topLevelTrees.has(stateKey)) {
      return collectionTreeOrder;
    }
    return getLeafNodeOrder(nodes, rotatedIds);
  }
);
