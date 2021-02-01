import { createSelector } from 'reselect';

import { getTreeState, getTitles } from './index';

import { topLevelTrees } from '../constants';

export const getTrees = state => getTreeState(state).entities;
export const hasTrees = state => Object.keys(getTrees(state)).length > 0;

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
