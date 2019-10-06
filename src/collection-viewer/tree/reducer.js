import { combineReducers } from 'redux';

import treeReducer from '@cgps/libmicroreact/tree/reducer';

import { FETCH_COLLECTION, UPDATE_COLLECTION_PROGRESS }
  from '../actions';
import * as ACTIONS from './actions';

import { topLevelTrees } from './constants';
import { COLLECTION, POPULATION } from '../../app/stateKeys/tree';

function getInitialState(newick) {
  const treeState = treeReducer(undefined, {});
  return {
    ...treeState,
    phylocanvas: {
      ...treeState.phylocanvas,
      source: newick,
      fontSize: 14,
    },
  };
}

function entities(state = {}, action) {
  if (action.stateKey) {
    const treeState = state[action.stateKey];
    return {
      ...state,
      [action.stateKey]: treeReducer(treeState, action),
    };
  }

  const { type, payload } = action;

  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { organism = {}, subtrees, tree } = payload.result;
      const initialState = getInitialState();

      const nextState = {
        ...state,
        ...subtrees.reduce((memo, subtree) => {
          memo[subtree.name] = {
            status: 'PENDING',
            progress: 0,
            lastStatus: 0,
            ...subtree,
            ...getInitialState(subtree.newick),
          };
          return memo;
        }, {}),
      };

      if (tree) {
        nextState[COLLECTION] = {
          status: 'PENDING',
          progress: 0,
          lastStatus: 0,
          ...tree,
          name: COLLECTION,
          ...getInitialState(tree.newick),
        };
      }

      if (organism.tree) {
        nextState[POPULATION] = {
          name: POPULATION,
          status: 'READY',
          leafIds: organism.references.map(_ => _.uuid),
          ...getInitialState(organism.tree),
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
          status: payload.result.status,
          ...getInitialState(),
          phylocanvas: {
            ...state[payload.stateKey].phylocanvas,
            source: payload.result.newick,
          },
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
        },
      };
    }
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
      return topLevelTrees.has(payload.name) ? state : payload.name;
    default:
      return state;
  }
}

function size(state = null, { type, payload }) {
  switch (type) {
    case 'SET PHYLOCANVAS STATE': {
      if (payload.size) return payload.size;
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  visible,
  loading,
  lastSubtree,
  size,
});
