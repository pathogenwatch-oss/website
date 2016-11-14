import { combineReducers } from 'redux';

import { FETCH_ENTITIES } from '../../actions/fetch';
import * as ACTIONS from './actions';

import { COLLECTION, POPULATION } from '../../app/stateKeys/tree';

const maxBaseSize = 10;
const minBaseSize = 3;

function setBaseSize({ leafIds, baseSize }, { step }) {
  return Math.min(maxBaseSize, Math.max(minBaseSize, step * 0.75));
}

function updateHistory(tree, { imgUrl }) {
  const { history, type, root, baseSize, scales } = tree;
  console.log(history, type, root);
  debugger;
  if (history.find(({ state }) => type === state.type && root === state.root)) {
    return tree;
  }
  return {
    ...tree,
    history: [
      { id: `${type}|${root}`,
        imgUrl,
        state: { type, root, baseSize, scales },
      },
      ...history,
    ],
  };
}

const initialState = {
  type: 'rectangular',
  scales: {
    node: 1,
    label: 1,
    max: 2,
  },
  history: [],
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
          leafIds: Object.keys(reference.assemblies),
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
    case ACTIONS.SET_TREE:
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          loaded: false,
        },
      };
    case ACTIONS.TREE_LOADED: {
      const treeState = state[payload.stateKey];
      return {
        ...state,
        [payload.stateKey]: {
          ...treeState,
          loaded: true,
          leafIds: treeState.leafIds || payload.leafIds,
          root: payload.root,
          baseSize: setBaseSize(treeState, payload),
        },
      };
    }
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
          scales: {
            ...state[payload.stateKey].scales,
            node: payload.scale,
          },
        },
      };
    case ACTIONS.SET_LABEL_SCALE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          scales: {
            ...state[payload.stateKey].scales,
            label: payload.scale,
          },
        },
      };
    case ACTIONS.ADD_HISTORY_SNAPSHOT:
      return {
        [payload.stateKey]: updateHistory(state[payload.stateKey], payload),
      };
    case ACTIONS.TIME_TRAVEL:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          ...payload.snapshot,
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
