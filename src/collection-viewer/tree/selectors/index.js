import { createSelector } from 'reselect';

import { getViewer, getCollection } from '../../selectors';

import { topLevelTrees } from '../constants';
import { POPULATION, COLLECTION } from '~/app/stateKeys/tree';
import Organisms from '~/organisms';

export const getTreeState = state => getViewer(state).tree;

export const getTreeStateKey = state => getTreeState(state).visible;
export const isLoading = state => getTreeState(state).loading;

export const isTopLevelTree = createSelector(
  getTreeStateKey,
  tree => topLevelTrees.has(tree)
);

export const getSingleTree = createSelector(
  getCollection,
  (collection) => {
    if (collection.size < 3) return POPULATION;
    if (Organisms.uiOptions.noPopulation) return COLLECTION;
    return null;
  }
);

export const getLastSubtree = createSelector(
  getTreeState,
  ({ lastSubtree }) => (
    lastSubtree ?
      { name: lastSubtree, title: lastSubtree } :
      null
  )
);
