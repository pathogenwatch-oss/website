import { createAsyncConstants } from '../../actions';

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

export function treeLoaded(stateKey, props) {
  return {
    type: TREE_LOADED,
    payload: {
      stateKey,
      ...props,
    },
  };
}

export const SET_TREE_TYPE = 'SET_TREE_TYPE';

export function setTreeType(stateKey, type) {
  return {
    type: SET_TREE_TYPE,
    payload: {
      stateKey,
      type,
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
