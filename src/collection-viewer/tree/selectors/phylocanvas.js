import { createSelector } from 'reselect';
import parse from '@cgps/phylocanvas/utils/parse';

import { getTreeState, getTreeStateKey, getTitles, getVisibleLibMRTree } from './index';
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

const getLeafNodeOrder = source => {
  if (!source) return [];
  const parsed = parse(source);
  return parsed.leafNodes.map(_ => _.id);
};

const getCollectionTreeOrder = createSelector(
  state => getTrees(state)[COLLECTION].newick,
  getLeafNodeOrder
);

export const getTreeOrder = createSelector(
  getTreeStateKey,
  getCollectionTreeOrder,
  state => getVisibleTree(state).newick,
  (stateKey, collectionTreeOrder, source) => {
    if (topLevelTrees.has(stateKey)) {
      return collectionTreeOrder;
    }
    return getLeafNodeOrder(source);
  }
);
