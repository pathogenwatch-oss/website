import { createSelector } from 'reselect';
import treeReducer from '@cgps/libmicroreact/tree/reducer';

import { getViewer } from '../../selectors';

import { topLevelTrees, titles } from '../constants';

export const getTreeState = state => getViewer(state).tree;

export const getTreeStateKey = state => getTreeState(state).visible;
export const isLoading = state => getTreeState(state).loading;

export const isTopLevelTree = createSelector(
  getTreeStateKey,
  tree => topLevelTrees.has(tree)
);

export const getTitles = state => getTreeState(state).titles;

export const getVisibleTreeLabel = createSelector(
  getTreeStateKey,
  getTitles,
  (key, subtrees) => subtrees[key] || titles[key] || '',
);

export const getLibMRTrees = createSelector(
  state => getTreeState(state).libmicroreact,
  trees => {
    const flattened = {};
    for (const [ key, { current } ] of Object.entries(trees)) {
      flattened[key] = current;
    }
    return flattened;
  }
);

export const getVisibleLibMRTree = createSelector(
  getTreeStateKey,
  getLibMRTrees,
  (tree, states) => (tree in states ? states[tree] : treeReducer(undefined, {}))
);

export const getTreeUnfilteredIds = createSelector(
  state => getVisibleLibMRTree(state).subtreeIds,
  (subtreeIds) => (subtreeIds === null ? [] : subtreeIds)
);

export const getTreeFilteredIds = createSelector(
  state => getVisibleLibMRTree(state).ids,
  (ids) => {
    if (ids !== null) {
      return ids;
    }
    return [];
  }
);
