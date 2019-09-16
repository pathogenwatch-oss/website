import { createSelector } from 'reselect';

import { getCollection, getViewer } from '../selectors';
import { getGenomeStyles } from '../selectors/styles';
import { getCollectionGenomeIds } from '../genomes/selectors';
import { getHighlightedIds } from '../highlight/selectors';
import { getFilteredGenomeIds } from '../filter/selectors';

import { simpleTrees } from './constants';

import { POPULATION, COLLECTION } from '~/app/stateKeys/tree';
import Organisms from '~/organisms';

export const getTreeState = state => getViewer(state).tree;

export const getTrees = state => getTreeState(state).entities;
export const hasTrees = state => Object.keys(getTrees(state)).length > 0;
export const isLoading = state => getTreeState(state).loading;
export const getTreeStateKey = state => getTreeState(state).visible;

export const getLeafIds = (state, { stateKey }) => {
  const trees = getTrees(state);

  if (stateKey === POPULATION) {
    if (COLLECTION in trees) {
      return trees[COLLECTION].leafIds;
    }
    return getCollectionGenomeIds(state);
  }

  if (stateKey in trees) {
    return trees[stateKey].leafIds;
  }

  return [];
};

export const getVisibleTree = createSelector(
  getTreeState,
  ({ visible, entities }) => (visible ? entities[visible] : null)
);

export const isLoaded = createSelector(
  getVisibleTree,
  tree => !!tree.phylocanvas.source
);
export const getTreeType = state => getVisibleTree(state).type;

export const getSingleTree = createSelector(
  getCollection,
  (collection) => {
    if (collection.size < 3) return POPULATION;
    if (Organisms.uiOptions.noPopulation) return COLLECTION;
    return null;
  }
);

// export const getFilenames = createSelector(
//   state => getVisibleTree(state).name,
//   state => getCollection(state).uuid,
//   state => getActiveDataTable(state).activeColumn,
//   utils.getFilenames
// );

export const getLastSubtree = createSelector(
  getTreeState,
  ({ lastSubtree }) => (
    lastSubtree ?
      { name: lastSubtree, title: lastSubtree } :
      null
  )
);

export const getSubtreeNames = createSelector(
  getTrees,
  trees => Object.keys(trees).filter(name => !simpleTrees.has(name))
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

const getNodeStyles = createSelector(
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

const scaleBarProps = {
  fontSize: 13,
  position: { left: 8, bottom: 16 },
};

const populationLeafNodeStyle = {
  shape: 'triangle',
  fillStyle: '#a386bd',
};

export const getPhylocanvasState = createSelector(
  getVisibleTree,
  getNodeStyles,
  getHighlightedIds,
  state => getTreeState(state).size,
  ({ phylocanvas, name }, nodeStyles, highlightedIds, size) => ({
    ...phylocanvas,
    leafNodeStyle: name === 'POPULATION' ? populationLeafNodeStyle : phylocanvas.leafNodeStyle,
    scalebar: scaleBarProps,
    selectedIds: Array.from(highlightedIds),
    size: size || phylocanvas.size,
    styles: nodeStyles,
  })
);

export const getTreeFilteredIds = createSelector(
  getVisibleTree,
  tree => tree.ids
);
