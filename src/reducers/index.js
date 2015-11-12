import { combineReducers } from 'redux';

import antibiotics from './antibiotics';
import collection from './collection';
import downloadsMenu from './downloadsMenu';

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
    collections: createReducer(collection),
  }),
  ui: combineReducers({
    downloadsMenu: createReducer(downloadsMenu),
  }),
  loading: combineReducers({ ready, error }),
});
