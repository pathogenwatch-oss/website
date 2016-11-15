import { createSelector } from 'reselect';

import { getFilter, getColourGetter } from '../selectors';

import { titles, speciesTrees, leafStyles } from './constants';
import * as utils from './utils';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import Species from '../../species';
import { CGPS } from '../../app/constants';

const getTreeState = ({ collectionViewer }) => collectionViewer.tree;

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
export const getBaseSize = state => getVisibleTree(state).baseSize;
export const getTreeScales = state => getVisibleTree(state).scales;

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
  ({ entities }) => entities.assemblies,
  ({ name }, assemblies) =>
    titles[name] || assemblies[name].metadata.assemblyName
);

export const getFilenames = createSelector(
  getTitle,
  ({ collection }) => collection.id,
  ({ tables }) => tables.metadata.activeColumn,
  utils.getFilenames
);

export const isSubtree = createSelector(
  getVisibleTree,
  tree => !speciesTrees.has(tree.name)
);
