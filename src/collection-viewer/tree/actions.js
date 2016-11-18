import { createAsyncConstants } from '../../actions';

import { takeSnapshot, getLinearStep } from './utils';

export const SET_TREE = 'SET_TREE';

export function setTree(name) {
  return {
    type: SET_TREE,
    payload: {
      name,
    },
  };
}

export const FETCH_TREE = createAsyncConstants('FETCH_TREE');

export function fetchTree(stateKey, promise) {
  return {
    type: FETCH_TREE,
    payload: {
      stateKey,
      promise,
    },
  };
}

export const TREE_LOADED = 'TREE_LOADED';

export function treeLoaded(stateKey, phylocanvas, leafIds) {
  return {
    type: TREE_LOADED,
    payload: {
      stateKey,
      root: phylocanvas.root.id,
      step: phylocanvas.step,
      leafIds: leafIds || phylocanvas.leaves.map(_ => _.id),
    },
  };
}

export const TREE_TYPE_CHANGED = 'TREE_TYPE_CHANGED';

export function typeChanged(stateKey, phylocanvas) {
  return {
    type: TREE_TYPE_CHANGED,
    payload: {
      stateKey,
      type: phylocanvas.treeType,
      step: getLinearStep(phylocanvas),
    },
  };
}

export const SET_NODE_SCALE = 'SET_NODE_SCALE';

export function setNodeScale(stateKey, scale) {
  return {
    type: SET_NODE_SCALE,
    payload: {
      stateKey,
      scale: parseFloat(scale),
    },
  };
}

export const SET_LABEL_SCALE = 'SET_LABEL_SCALE';

export function setLabelScale(stateKey, scale) {
  return {
    type: SET_LABEL_SCALE,
    payload: {
      stateKey,
      scale: parseFloat(scale),
    },
  };
}

export const ADD_HISTORY_SNAPSHOT = 'ADD_HISTORY_SNAPSHOT';

export function addHistorySnapshot(stateKey, phylocanvas) {
  return {
    type: ADD_HISTORY_SNAPSHOT,
    payload: {
      stateKey,
      image: takeSnapshot(phylocanvas),
    },
  };
}

export const TIME_TRAVEL = 'TIME_TRAVEL';

export function timeTravel(stateKey, snapshot) {
  return {
    type: TIME_TRAVEL,
    payload: {
      stateKey,
      snapshot,
    },
  };
}
