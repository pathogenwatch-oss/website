import { createSelector } from 'reselect';

import { getCollection, getGenomes, getViewer } from '../../collection-viewer/selectors';
import { getActiveDataTable } from '../table/selectors';

import { titles, simpleTrees } from './constants';
import * as utils from './utils';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import Organisms from '../../organisms';

export const getTreeState = state => getViewer(state).tree;

export const getTrees = state => getTreeState(state).entities;
export const isLoading = state => getTreeState(state).loading;

export const getLeafIds = (state, { stateKey }) =>
  getTrees(state)[stateKey].leafIds;

export const getVisibleTree = createSelector(
  getTreeState,
  ({ visible, entities }) => entities[visible]
);

export const isLoaded = state => getVisibleTree(state).loaded;
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
  (tree, genomes) => titles[tree.name] || genomes[tree.name].name
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
