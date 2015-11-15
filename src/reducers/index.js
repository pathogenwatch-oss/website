import { combineReducers } from 'redux';

// entities
import antibiotics from './antibiotics';
import collection from './collection';
import subtrees from './subtrees';

// tables
import metadata from './metadata';

// display
import mapMarkers from './mapMarkers';

// ui
import downloadsMenu from './downloadsMenu';
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
  tables: combineReducers({
    metadata: createReducer(metadata),
  }),
  display: combineReducers({
    mapMarkers: createReducer(mapMarkers),
    // labels: createReducer(displayLabels),
    // colours: createReducer(displayColours),
    // subtree: createReducer(displayedSubtree),
  }),
  // filter: combineReducers({
  //   visibleAssemblyIds: createReducer(visibleAssemblyIds),
  // }),
  ui: combineReducers({
    downloadsMenu: createReducer(downloadsMenu),
    treeLinks: createReducer(treeLinks),
    bodyClickEvent,
  }),
  loading: combineReducers({ ready, error }),
});
