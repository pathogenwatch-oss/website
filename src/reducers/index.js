import { combineReducers } from 'redux';

import antibiotics from './antibiotics';
import collection from './collection';

function createReducer({ actions, initialState }) {
  return function (state = initialState, action) {
    if (actions[action.type]) {
      return actions[action.type](state, action);
    }
    return state;
  };
}

export default combineReducers({
  antibiotics: createReducer(antibiotics),
  collection: createReducer(collection),
});
