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

import bodyClickEvent from './bodyClickEvent';

import { RESET_STORE } from '../actions/reset';

function createReducer({ actions, initialState }) {
  return function (state = initialState, action) {
    if (actions[action.type]) {
      return actions[action.type](state, action);
    }
    return state;
  };
}

const rootReducer = combineReducers({
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
    files: createReducer(downloads),
  }),
  bodyClickEvent,
  loading: combineReducers({
    tree: createReducer(treeLoading),
  }),
});

const initialState = rootReducer({}, {});

export default function (state = initialState, action = {}) {
  if (action.type === RESET_STORE) {
    return initialState;
  }

  return rootReducer(state, action);
}
