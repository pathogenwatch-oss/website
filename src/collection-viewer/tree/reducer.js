import { combineReducers } from 'redux';

import { FETCH_ENTITIES } from '../../actions/fetch';
import { FETCH_TREE, SET_TREE } from './actions';

import { COLLECTION, POPULATION } from '../../app/stateKeys/tree';

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS: {
      const [ uploaded, reference ] = payload.result;
      return {
        [COLLECTION]: { name: COLLECTION, newick: uploaded.tree },
        [POPULATION]: { name: POPULATION, newick: reference.tree },
      };
    }
    case FETCH_TREE.SUCCESS:
      return {
        ...state,
        [payload.stateKey]: {
          name: payload.stateKey,
          newick: payload.result.tree,
        },
      };
    default:
      return state;
  }
}

function visible(state = COLLECTION, { type, payload }) {
  switch (type) {
    case SET_TREE:
      return payload.name;
    default:
      return state;
  }
}

function loading(state = false, { type }) {
  switch (type) {
    case FETCH_TREE.ATTEMPT:
      return true;
    case FETCH_TREE.FAILURE:
    case FETCH_TREE.SUCCESS:
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
