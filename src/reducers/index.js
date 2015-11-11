import { combineReducers } from 'redux';

import antibiotics from './antibiotics';
import collection from './collection';

import { ready, error } from './fetch';

function createReducer({ actions, initialState }) {
  return function (state = initialState, action) {
    if (actions[action.type]) {
      return actions[action.type](state, action);
    }
    return state;
  };
}

export default combineReducers({
  entities: combineReducers({
    antibiotics: createReducer(antibiotics),
    collection: createReducer(collection),
  }),
  loading: combineReducers({ ready, error }),
});
