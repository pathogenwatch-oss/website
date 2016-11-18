import { combineReducers } from 'redux';

import { FETCH_ENTITIES } from '../../actions/fetch';
import * as ACTIONS from './actions';

import { COLLECTION, POPULATION } from '../../app/stateKeys/tree';

function setSize(state, step, maxScalar) {
  if (step === state.step) return state;

  const { max = 1 } = state;
  const newMax = Math.ceil(maxScalar / step);
  const newScale = Math.max(1, Math.min(1 * max / newMax, newMax));

  return {
    ...state,
    step,
    base: step / 2,
    scale: newScale,
    max: newMax,
  };
}

function setNodeSize(state, { step }) {
  return setSize(state, step, 30);
}

function setLabelSize(state, { step }) {
  return setSize(state, step, 40);
}

function updateHistory(tree, { image }) {
  const { history, type, root, nodeSize, labelSize } = tree;
  const id = `${type}|${root}`;

  if (history.find(snapshot => snapshot.id === id)) {
    return history;
  }

  return [
    { id,
      image,
      state: { type, root, nodeSize, labelSize },
    },
    ...history,
  ];
}

const initialState = {
  type: 'rectangular',
  nodeSize: {},
  labelSize: {},
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
          leafIds: uploaded.tree ? null : Object.keys(uploaded.assemblies),
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
          nodeSize: setNodeSize(treeState.nodeSize, payload),
          labelSize: setLabelSize(treeState.labelSize, payload),
        },
      };
    }
    case ACTIONS.TREE_TYPE_CHANGED: {
      const treeState = state[payload.stateKey];
      return {
        ...state,
        [payload.stateKey]: {
          ...treeState,
          type: payload.type,
          nodeSize: setNodeSize(treeState.nodeSize, payload),
          labelSize: setLabelSize(treeState.labelSize, payload),
        },
      };
    }
    case ACTIONS.SET_NODE_SCALE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          nodeSize: {
            ...state[payload.stateKey].nodeSize,
            scale: payload.scale,
          },
        },
      };
    case ACTIONS.SET_LABEL_SCALE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          labelSize: {
            ...state[payload.stateKey].labelSize,
            scale: payload.scale,
          },
        },
      };
    case ACTIONS.ADD_HISTORY_SNAPSHOT: {
      const treeState = state[payload.stateKey];
      return {
        ...state,
        [payload.stateKey]: {
          ...treeState,
          history: updateHistory(treeState, payload),
        },
      };
    }
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
