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

const getFilenames = createSelector(
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
  state => getTreeState(state).size,
  getFilenames,
  ({ name, newick }, { phylocanvas }, nodeStyles, highlightedIds, size, filenames) => ({
    ...phylocanvas,
    leafNodeStyle: name === POPULATION ? populationLeafNodeStyle : phylocanvas.leafNodeStyle,
    renderLeafLabels: name === POPULATION || phylocanvas.renderLeafLabels,
    scalebar: scaleBarProps,
    selectedIds: highlightedIds,
    size: size || phylocanvas.size,
    source: phylocanvas.source || newick,
    styles: nodeStyles,
    contextMenu: {
      ...phylocanvas.contextMenu,
      filenames,
    },
  })
);

const getLeafNodeOrder = (source, rotatedIds = []) => {
  if (!source) return [];
  const nodes = parse(source);

  for (const id of rotatedIds) {
    const node = nodes.nodeById[id];
    rotateSubtree(null, nodes, node);
  }

  return (
    nodes.preorderTraversal
      .filter(_ => _.isLeaf)
      .map(_ => _.id)
  );
};

const getCollectionPhylocanvasState = state => {
  const libmrStates = getLibMRTrees(state);
  if (COLLECTION in libmrStates) {
    return libmrStates[COLLECTION].phylocanvas;
  }
  return {};
};

const getCollectionTreeOrder = createSelector(
  state => getCollectionPhylocanvasState(state).source,
  state => getTrees(state)[COLLECTION].newick,
  state => getCollectionPhylocanvasState(state).rotatedIds,
  (source, newick, rotatedIds) => getLeafNodeOrder(source || newick, rotatedIds)
);

export const getTreeOrder = createSelector(
  getTreeStateKey,
  getCollectionTreeOrder,
  state => getVisibleLibMRTree(state).phylocanvas.source,
  state => getVisibleLibMRTree(state).phylocanvas.rotatedIds,
  (stateKey, collectionTreeOrder, source, rotatedIds) => {
    if (topLevelTrees.has(stateKey)) {
      return collectionTreeOrder;
    }
    return getLeafNodeOrder(source, rotatedIds);
  }
);
