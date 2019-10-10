import { createAsyncConstants } from '../../actions';

import * as api from './api';

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

export const INTERNAL_NODE_SELECTED = 'INTERNAL_NODE_SELECTED';

export function internalNodeSelected(stateKey, nodeId) {
  return {
    type: INTERNAL_NODE_SELECTED,
    payload: {
      stateKey,
      nodeId,
    },
  };
}


export const FETCH_TREE_POSITION = createAsyncConstants('FETCH_TREE_POSITION');

export function fetchTreePosition(stateKey, date) {
  return {
    type: FETCH_TREE_POSITION,
    payload: {
      stateKey,
      promise: api.fetchTreePosition(date),
    },
  };
}


export const RESET_TREE_ROOT = 'RESET_TREE_ROOT';

export function resetTreeRoot(stateKey) {
  return {
    type: RESET_TREE_ROOT,
    payload: {
      stateKey,
    },
  };
}
