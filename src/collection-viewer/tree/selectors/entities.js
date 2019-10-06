import { createSelector } from 'reselect';
import parse from '@cgps/phylocanvas/utils/parse';

import { getTreeState, getTreeStateKey } from './index';
import { getGenomeStyles } from '../../selectors/styles';
import { getHighlightedIdArray } from '../../highlight/selectors';
import { getFilteredGenomeIds } from '../../filter/selectors';
import { getGenomes } from '../../genomes/selectors';

import { topLevelTrees } from '../constants';
import { CGPS } from '~/app/constants';
import { POPULATION, COLLECTION } from '~/app/stateKeys/tree';

export const getTrees = state => getTreeState(state).entities;
export const hasTrees = state => Object.keys(getTrees(state)).length > 0;

export const getVisibleTree = createSelector(
  getTreeState,
  ({ visible, entities }) => (visible ? entities[visible] : null)
);

export const isLoaded = createSelector(
  getVisibleTree,
  tree => !!tree.phylocanvas.source
);
export const getTreeType = state => getVisibleTree(state).type;


export const getSubtreeNames = createSelector(
  getTrees,
  trees => Object.keys(trees).filter(name => !topLevelTrees.has(name))
);

export const getSelectedInternalNode = createSelector(
  state => getTreeState(state).selectedInternalNode,
  ({ trees, active }) => trees[active]
);

export const areTreesComplete = createSelector(
  getTrees,
  trees => {
    for (const key of Object.keys(trees)) {
      if (trees[key].status !== 'READY') {
        return false;
      }
    }
    return true;
  }
);

const getStandardNodeStyles = createSelector(
  getGenomeStyles,
  state => (getFilteredGenomeIds ? getFilteredGenomeIds(state) : []),
  (genomeStyles, ids) => {
    const styles = {};
    for (const genomeId of Object.keys(genomeStyles)) {
      const isActive = ids.includes(genomeId);
      styles[genomeId] = {
        fillStyle: genomeStyles[genomeId].colour,
        strokeStyle: genomeStyles[genomeId].colour,
        shape: isActive ? genomeStyles[genomeId].shape : 'none',
        label: genomeStyles[genomeId].label,
      };
    }
    return styles;
  }
);

const getPopulationLabel = ({ status, name, size, populationSize, progress }) => {
  if (status === 'PENDING') {
    return `${name}: Pending`;
  } else if (status === 'IN PROGRESS') {
    return `${name}: ${progress}%`;
  } else if (status === 'ERROR') {
    return `${name}: Error, awaiting retry`;
  } else if (status === 'FAILED') {
    return `${name}: Failed`;
  } else if (status === 'READY') {
    const totalCollection = size - populationSize;
    if (populationSize > 0) {
      return `${name} (${totalCollection}) [${populationSize}]`;
    } else if (totalCollection > 0) {
      return `${name} (${totalCollection})`;
    }
    return name;
  }
};

const getPopulationNodeStyles = createSelector(
  getTrees,
  getSubtreeNames,
  state => getTrees(state)[POPULATION].leafIds,
  (trees, subtreeNames, treeIds) => {
    const styles = {};
    for (const id of treeIds) {
      if (subtreeNames.includes(id)) {
        styles[id] = {
          fillStyle: CGPS.COLOURS.PURPLE_LIGHT,
          fontStyle: 'bold',
          label: getPopulationLabel(trees[id]),
        };
      } else {
        styles[id] = {
          fillStyle: CGPS.COLOURS.GREY,
        };
      }
    }
    return styles;
  }
);

const getNodeStyles = state => {
  const { name } = getVisibleTree(state);
  return name === POPULATION ?
    getPopulationNodeStyles(state) :
    getStandardNodeStyles(state);
};

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

export const getTreeFilteredIds = createSelector(
  getVisibleTree,
  tree => tree.ids
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
