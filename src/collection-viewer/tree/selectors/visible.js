import { createSelector } from 'reselect';

import { getViewer } from '../../selectors';

import { topLevelTrees } from '../constants';

export const getTreeStateKey = state => getViewer(state).tree.visible;

export const isTopLevelTree = createSelector(
  getTreeStateKey,
  tree => topLevelTrees.has(tree)
);
