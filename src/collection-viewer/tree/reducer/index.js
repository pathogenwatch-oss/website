import { combineReducers } from 'redux';

import phylocanvas from './phylocanvas';

import { FETCH_COLLECTION, UPDATE_COLLECTION_PROGRESS } from '../../actions';
import * as ACTIONS from '../actions';

import { topLevelTrees } from '../constants';
import { COLLECTION, POPULATION } from '~/app/stateKeys/tree';


function entities(state = {}, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { organism = {}, subtrees, tree } = payload.result;

      const nextState = {
        ...state,
        ...subtrees.reduce((memo, subtree) => {
          memo[subtree.name] = {
            status: 'PENDING',
            progress: 0,
            lastStatus: 0,
            ...subtree,
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
        };
      }

      if (organism.tree) {
        nextState[POPULATION] = {
          name: POPULATION,
          status: 'READY',
          leafIds: organism.references.map(_ => _.uuid),
          newick: organism.tree,
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
          newick: payload.result.newick,
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

function titles(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { organism = {}, subtrees } = payload.result;
      const nextState = {};
      for (const subtree of subtrees) {
        const reference = organism.references.find(_ => _.uuid === subtree.name);
        if (reference) {
          nextState[subtree.name] = reference.name;
        }
      }
      return nextState;
    }
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  lastSubtree,
  loading,
  phylocanvas,
  size,
  titles,
  visible,
});
