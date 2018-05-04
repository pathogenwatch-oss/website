import { combineReducers } from 'redux';

import { FETCH_COLLECTION, UPDATE_COLLECTION_PROGRESS }
  from '../actions';
import { RESET_FILTER, ACTIVATE_FILTER } from '../filter/actions';
import { SEARCH_TERM_ADDED } from '../search/actions';
import * as ACTIONS from './actions';

import { simpleTrees } from './constants';
import { COLLECTION, POPULATION } from '../../app/stateKeys/tree';

import Organisms from '../../organisms';

function setSize(state, step, maxStepFactor) {
  if (step === state.step) return state;

  return {
    ...state,
    step,
    base: Math.min(step / 2, 15),
    scale: 1,
    max: Math.ceil(maxStepFactor / step),
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

function getInitialState() {
  return {
    type: Organisms.uiOptions.defaultTree || 'rectangular',
    nodeSize: {},
    labelSize: {},
    history: [],
  };
}

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { organism, subtrees, tree } = payload.result;

      const initialState = getInitialState();

      const nextState = {
        ...state,
        ...subtrees.reduce((memo, subtree) => {
          memo[subtree.name] = {
            status: 'PENDING',
            progress: 0,
            lastStatus: 0,
            ...subtree,
            ...initialState,
          };
          return memo;
        }, {}),
      };

      if (tree) {
        nextState[COLLECTION] = {
          newick: null,
          status: 'PENDING',
          progress: 0,
          lastStatus: 0,
          ...tree,
          name: COLLECTION,
          ...initialState,
        };
      }

      if (organism.tree) {
        nextState[POPULATION] = {
          name: POPULATION,
          status: 'READY',
          newick: organism.tree,
          leafIds: organism.references.map(_ => _.uuid),
          ...initialState,
        };
      }

      return nextState;
    }
    case ACTIONS.FETCH_TREE_POSITION.SUCCESS:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          position: payload.result.position,
        },
      };
    case UPDATE_COLLECTION_PROGRESS: {
      if (payload.task === 'tree') {
        const tree = state[COLLECTION];
        if (payload.status && payload.timestamp >= tree.lastStatus) {
          return {
            ...state,
            [COLLECTION]: {
              ...tree,
              status: payload.status,
              progress: 0,
              lastStatus: payload.timestamp,
            },
          };
        }
        if (payload.progress && payload.progress > tree.progress) {
          return {
            ...state,
            [COLLECTION]: {
              ...tree,
              status: 'IN PROGRESS',
              progress: Math.floor(payload.progress),
            },
          };
        }
      }
      if (payload.task === 'subtree') {
        if (!(payload.name in state)) return state;
        const tree = state[payload.name];
        if (payload.status && payload.timestamp >= tree.lastStatus) {
          return {
            ...state,
            [payload.name]: {
              ...tree,
              status: payload.status,
              lastStatus: payload.timestamp,
              size: payload.size,
              populationSize: payload.populationSize,
            },
          };
        } else if (payload.progress && payload.progress > tree.progress) {
          return {
            ...state,
            [payload.name]: {
              ...tree,
              progress: Math.floor(payload.progress),
            },
          };
        }
      }
      return state;
    }
    case ACTIONS.FETCH_TREE.SUCCESS:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          name: payload.stateKey,
          newick: payload.result.newick,
          status: payload.result.status,
          ...getInitialState(),
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

function visible(state = null, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { tree } = payload.result;
      if (tree) {
        return tree.status === 'READY' ? COLLECTION : state;
      }
      return POPULATION;
    }
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

function lastSubtree(state = null, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_TREE:
      return simpleTrees.has(payload.name) ? state : payload.name;
    default:
      return state;
  }
}

function clearSelected(state) {
  return {
    ...state,
    trees: {
      ...state.trees,
      [state.active]: null,
    },
  };
}

function selectedInternalNode(state = { active: COLLECTION, trees: {} }, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_TREE:
      return {
        ...state,
        active: payload.name,
      };
    case ACTIONS.INTERNAL_NODE_SELECTED:
      return {
        ...state,
        trees: {
          ...state.trees,
          [payload.stateKey]: payload.nodeId,
        },
      };
    case ACTIVATE_FILTER:
    case RESET_FILTER: {
      if (payload.key !== 'VISIBILITY') return state;
      return clearSelected(state);
    }
    case SEARCH_TERM_ADDED:
      return clearSelected(state);
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  visible,
  loading,
  lastSubtree,
  selectedInternalNode,
});
