import { createSelector } from 'reselect';

import {
  getCollection,
  getViewer,
} from '../selectors';
import {
  getGenomes,
  getGenomeList,
  getCollectionGenomeIds,
} from '../genomes/selectors';
import { getActiveDataTable } from '../table/selectors';
import { getFilteredGenomeIds } from '../filter/selectors';
import { getHighlightedIds } from '../highlight/selectors';
import { getGenomeStyles } from '../styles/selectors';

import { titles, simpleTrees } from './constants';
import * as utils from './utils';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import Organisms from '../../organisms';

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

export const getTitle = createSelector(
  getVisibleTree,
  getGenomes,
  (tree, genomes) => (tree ? (titles[tree.name] || genomes[tree.name].name) : null)
);

export const getFilenames = createSelector(
  getTitle,
  state => getCollection(state).uuid,
  state => getActiveDataTable(state).activeColumn,
  utils.getFilenames
);

export const getLastSubtree = createSelector(
  getTreeState,
  getGenomes,
  ({ lastSubtree }, genomes) => (
    lastSubtree ?
      { name: lastSubtree, title: genomes[lastSubtree].name } :
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
  getGenomeList,
  getGenomeStyles,
  getFilteredGenomeIds,
  (genomes, genomeStyles, ids) => {
    const styles = {};

    for (const genome of genomes) {
      const isActive = ids.includes(genome.id);
      styles[genome.id] = {
        fillStyle: genomeStyles[genome.id].colour,
        strokeStyle: genomeStyles[genome.id].colour,
        shape: isActive ? genomeStyles[genome.id].shape : 'none',
        label: genomeStyles[genome.id].label,
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
