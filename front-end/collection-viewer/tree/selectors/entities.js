import { createSelector } from 'reselect';

import { getTreeState, getTitles } from './index';

import { topLevelTrees } from '../constants';
import { POPULATION } from '~/app/stateKeys/tree';

export const getTrees = state => getTreeState(state).entities;
export const hasTrees = state => {
  const trees = getTrees(state);
  return Object.keys(trees).length > 1 ||
    (Object.keys(trees).length === 1 && !(POPULATION in trees));
};

export const getVisibleTree = createSelector(
  getTreeState,
  ({ visible, entities }) => (visible ? entities[visible] : null)
);

export const isLoaded = createSelector(
  getVisibleTree,
  tree => !!tree.newick
);

export const getSubtreeNames = createSelector(
  getTrees,
  trees => Object.keys(trees).filter(name => !topLevelTrees.has(name))
);

export const getSelectedInternalNode = createSelector(
  state => getTreeState(state).selectedInternalNode,
  ({ trees, active }) => trees[active]
);

export const areTreesComplete = createSelector(
  hasTrees,
  getTrees,
  (doesHaveTrees, trees) => {
    if (!doesHaveTrees) { return true; }
    for (const key of Object.keys(trees)) {
      if (trees[key].status !== 'READY') {
        return false;
      }
    }
    return true;
  }
);

export const getSubtreeMenuItems = createSelector(
  getTitles,
  getTrees,
  (titles, entities) => {
    const menuItems = [];
    for (const key of Object.keys(titles).sort()) {
      if (key in entities && entities[key].status === 'READY') {
        menuItems.push([ key, titles[key] ]);
      }
    }
    return menuItems;
  }
);
