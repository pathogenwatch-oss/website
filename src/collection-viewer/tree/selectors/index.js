import { createSelector } from 'reselect';

import { getViewer } from '../../selectors';

import { topLevelTrees } from '../constants';

export const getTreeState = state => getViewer(state).tree.current;

export const getTreeStateKey = state => getTreeState(state).visible;
export const isLoading = state => getTreeState(state).loading;

export const isTopLevelTree = createSelector(
  getTreeStateKey,
  tree => topLevelTrees.has(tree)
);

export const getTitles = state => getTreeState(state).titles;

export const getLastSubtree = createSelector(
  getTreeState,
  getTitles,
  ({ lastSubtree }, titles) => (
    lastSubtree ?
      { name: lastSubtree, title: titles[lastSubtree] } :
      null
  )
);
