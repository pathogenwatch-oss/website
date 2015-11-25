import { combineReducers } from 'redux';

// entities
import antibiotics from './antibiotics';
import { assemblies, trees, collection } from './collection';

// tables
import metadata from './metadata';
import resistanceProfile from './resistanceProfile';

// display
import table from './table';
import mapMarkers from './mapMarkers';
import tree from './tree';

// filter
import filter from './filter';

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
    assemblies: createReducer(assemblies),
    trees: createReducer(trees),
  }),
  collection: createReducer(collection),
  tables: combineReducers({
    metadata: createReducer(metadata),
    resistanceProfile: createReducer(resistanceProfile),
  }),
  display: combineReducers({
    table: createReducer(table),
    mapMarkers: createReducer(mapMarkers),
    tree: createReducer(tree),
  }),
  filter: createReducer(filter),
  ui: combineReducers({
    downloadsMenu: createReducer(downloadsMenu),
    treeLinks: createReducer(treeLinks),
    bodyClickEvent,
  }),
  loading: combineReducers({ ready, error }),
});
