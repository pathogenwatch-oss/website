import { combineReducers } from 'redux';

import { FETCH_ENTITIES } from '../../actions/fetch';
import * as ACTIONS from './actions';

import { COLLECTION, POPULATION } from '../../app/stateKeys/tree';

const initialMaxScale = 2;
const maxBaseSize = 10;
const minBaseSize = 3;

function setBaseSize({ step }) {
  const baseSize = Math.min(maxBaseSize, Math.max(minBaseSize, step / 2));
  return {
    baseSize,
    scales: {
      node: 1,
      label: 1,
      max: Math.max(initialMaxScale, maxBaseSize / (baseSize / 2)),
    },
  };
}

const initialState = {
  type: 'rectangular',
  scales: {
    node: 1,
    label: 1,
    max: initialMaxScale,
  },
};

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS: {
      const [ uploaded, reference ] = payload.result;
      return {
        [COLLECTION]: {
          name: COLLECTION,
          newick: uploaded.tree,
          ...initialState,
        },
        [POPULATION]: {
          name: POPULATION,
          newick: reference.tree,
          ...initialState,
        },
      };
    }
    case ACTIONS.FETCH_TREE.SUCCESS:
      return {
        ...state,
        [payload.stateKey]: {
          name: payload.stateKey,
          newick: payload.result.tree,
          ...initialState,
        },
      };
    case ACTIONS.SET_BASE_SIZE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          ...setBaseSize(payload),
        },
      };
    case ACTIONS.SET_TREE_TYPE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          type: payload.type,
        },
      };
    case ACTIONS.SET_NODE_SCALE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          scale: {
            ...state[payload.stateKey].scale,
            node: payload.scale,
          },
        },
      };
    case ACTIONS.SET_LABEL_SCALE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          scale: {
            ...state[payload.stateKey].scale,
            label: payload.scale,
          },
        },
      };
    default:
      return state;
  }
}

function visible(state = COLLECTION, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_TREE:
      return payload.name;
    default:
      return state;
  }
}

function loading(state = false, { type }) {
  switch (type) {
    case ACTIONS.FETCH_TREE.ATTEMPT:
      return true;
    case ACTIONS.FETCH_TREE.FAILURE:
    case ACTIONS.FETCH_TREE.SUCCESS:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  visible,
  loading,
});
