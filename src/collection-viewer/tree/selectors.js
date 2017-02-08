import { createSelector } from 'reselect';

import { getGenomes, getViewer } from '../../collection-route/selectors';
import { getActiveDataTable } from '../table/selectors';

import { titles } from './constants';
import * as utils from './utils';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import Species from '../../species';

export const getTreeState = state => getViewer(state).tree;

export const getTrees = state => getTreeState(state).entities;
export const isLoading = state => getTreeState(state).loading;

export const getLeafIds = (state, { stateKey }) =>
  getTrees(state)[stateKey].leafIds;

export const getVisibleTree = createSelector(
  getTreeState,
  ({ visible, entities }) => {
    const visibleTree = entities[visible];
    return visibleTree.newick ? visibleTree : entities[POPULATION];
  }
);

export const isLoaded = state => getVisibleTree(state).loaded;
export const getTreeType = state => getVisibleTree(state).type;

export const getSingleTree = createSelector(
  getTrees,
  trees => {
    const collectionTree = trees[COLLECTION];
    if (Species.uiOptions.noPopulation) return COLLECTION;
    if (!(collectionTree && collectionTree.newick)) return POPULATION;
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
  ({ collection }) => collection.uuid,
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
