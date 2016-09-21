import { combineReducers } from 'redux';

import antibiotics from './antibiotics';
import { assemblies, collection, reference } from './collection';

import hub from '../hub/reducers';
import hubFilter from '../hub/reducers/filter';
import fastas from '../hub/reducers/fastas';
import uploads from '../hub/reducers/uploads';

import metadata from './metadata';
import resistanceProfile from './resistanceProfile';

import header from './header';
import table from './table';
import mapMarkers from './mapMarkers';
import { trees, displayedTree, treeLoading } from './tree';

import filter from './filter';

import downloads from './downloads';
import downloadsMenu from './downloadsMenu';

import bodyClickListener from './bodyClickListener';

import { RESET_STORE } from '../actions/reset';

function createReducer({ actions, initialState }) {
  return function (state = initialState, action) {
    if (actions[action.type]) {
      return actions[action.type](state, action.payload || action);
    }
    return state;
  };
}

const rootReducer = combineReducers({
  entities: combineReducers({
    antibiotics: createReducer(antibiotics),
    assemblies: createReducer(assemblies),
    trees: createReducer(trees),
    fastas: createReducer(fastas),
  }),
  collection: createReducer(collection),
  reference: createReducer(reference),
  tables: combineReducers({
    metadata: createReducer(metadata),
    resistanceProfile: createReducer(resistanceProfile),
  }),
  display: combineReducers({
    header: createReducer(header),
    table: createReducer(table),
    mapMarkers: createReducer(mapMarkers),
    tree: combineReducers({
      name: createReducer(displayedTree),
      loading: createReducer(treeLoading),
    }),
  }),
  filter: createReducer(filter),
  downloads: combineReducers({
    menuOpen: createReducer(downloadsMenu),
    files: createReducer(downloads),
  }),
  bodyClickListener,
  hub: combineReducers({
    fastaOrder: createReducer(hub.fastaOrder),
    uploads: createReducer(uploads),
    loading: createReducer(hub.loading),
    filter: createReducer(hubFilter),
  }),
});

const initialState = rootReducer({}, {});

export default function (state = initialState, action = {}) {
  if (action.type === RESET_STORE) {
    return {
      ...initialState,
      entities: state.entities,
      hub: state.hub,
    };
  }

  return rootReducer(state, action);
}
