import { combineReducers } from 'redux';

import antibiotics from './antibiotics';
import { assemblies, collection, reference } from './collection';

import metadata from './metadata';
import resistanceProfile from './resistanceProfile';

import table from './table';
import mapMarkers from './mapMarkers';
import { trees, displayedTree, treeLoading } from './tree';

import filter from './filter';

import downloads from './downloads';
import downloadsMenu from './downloadsMenu';
import treeLinks from './treeLinks';

import bodyClickEvent from './bodyClickEvent';

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
  reference: createReducer(reference),
  tables: combineReducers({
    metadata: createReducer(metadata),
    resistanceProfile: createReducer(resistanceProfile),
  }),
  display: combineReducers({
    table: createReducer(table),
    mapMarkers: createReducer(mapMarkers),
    tree: createReducer(displayedTree),
  }),
  filter: createReducer(filter),
  downloads: combineReducers({
    menuOpen: createReducer(downloadsMenu),
    treeLinks: createReducer(treeLinks),
    files: createReducer(downloads),
  }),
  bodyClickEvent,
  loading: combineReducers({
    collection: combineReducers({ ready, error }),
    tree: createReducer(treeLoading),
  }),
});
