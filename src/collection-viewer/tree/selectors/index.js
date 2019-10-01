import { createSelector } from 'reselect';

import { getViewer } from '../../selectors';

import { topLevelTrees } from '../constants';

export const getTreeState = state => getViewer(state).tree;

export const getTreeStateKey = state => getTreeState(state).visible;
export const isLoading = state => getTreeState(state).loading;

export const isTopLevelTree = createSelector(
  getTreeStateKey,
  tree => topLevelTrees.has(tree)
);

export const getLastSubtree = createSelector(
  getTreeState,
  ({ lastSubtree }) => (
    lastSubtree ?
      { name: lastSubtree, title: lastSubtree } :
      null
  )
);
