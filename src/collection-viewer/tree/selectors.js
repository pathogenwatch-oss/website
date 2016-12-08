import { createSelector } from 'reselect';

import { getAssemblies, getViewer } from '../../collection-route/selectors';
import { getMetadataTable } from '../table/selectors';

import { titles, speciesTrees } from './constants';
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
  getAssemblies,
  (tree, assemblies) => titles[tree.name] || assemblies[tree.name].name
);

export const getFilenames = createSelector(
  getTitle,
  ({ collection }) => collection.id,
  state => getMetadataTable(state).activeColumn,
  utils.getFilenames
);

export const isSubtree = createSelector(
  getVisibleTree,
  tree => !speciesTrees.has(tree.name)
);
