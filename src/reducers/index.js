import { combineReducers } from 'redux';

// entities
import antibiotics from './antibiotics';
import collection from './collection';
import subtrees from './subtrees';

// ui
import downloadsMenu from './downloadsMenu';
import userDefinedColumns from './userDefinedColumns';
import treeLinks from './treeLinks';
import bodyClickEvent from './bodyClickEvent';

// util
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
    subtrees: createReducer(subtrees),
  }),
  ui: combineReducers({
    downloadsMenu: createReducer(downloadsMenu),
    userDefinedColumns: createReducer(userDefinedColumns),
    treeLinks: createReducer(treeLinks),
    bodyClickEvent,
  }),
  loading: combineReducers({ ready, error }),
  // display: combineReducers({
  //   labels: createReducer(displayLabels),
  //   colours: createReducer(displayColours),
  //   subtree: createReducer(displayedSubtree),
  // }),
  // filter: combineReducers({
  //   visibleAssemblyIds: createReducer(visibleAssemblyIds),
  // }),
});
