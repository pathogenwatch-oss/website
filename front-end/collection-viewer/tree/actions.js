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
