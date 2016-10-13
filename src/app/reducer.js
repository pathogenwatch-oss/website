import { combineReducers } from 'redux';

import aboutCollectionOpen from '../about-collection-dropdown/reducer';
import antibiotics from '../reducers/antibiotics';
import bodyClickListener from '../reducers/bodyClickListener';
import { assemblies, collection, reference } from '../reducers/collection';
import downloads from '../reducers/downloads';
import downloadsMenu from '../reducers/downloadsMenu';
import filter from '../reducers/filter';
import { reducer as header } from '../header';
import hub from '../hub/reducers';
import fastas from '../hub/reducers/fastas';
import mapMarkers from '../reducers/mapMarkers';
import metadata from '../reducers/metadata';
import { reducer as location } from '../nav-link/';
import resistanceProfile from '../reducers/resistanceProfile';
import table from '../reducers/table';
import { reducer as toast } from '../toast';
import { trees, displayedTree, treeLoading } from '../reducers/tree';

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
  bodyClickListener,
  collection: createReducer(collection),
  display: combineReducers({
    table: createReducer(table),
    mapMarkers: createReducer(mapMarkers),
    tree: combineReducers({
      name: createReducer(displayedTree),
      loading: createReducer(treeLoading),
    }),
    aboutCollectionOpen,
  }),
  downloads: combineReducers({
    menuOpen: createReducer(downloadsMenu),
    files: createReducer(downloads),
  }),
  entities: combineReducers({
    antibiotics: createReducer(antibiotics),
    assemblies: createReducer(assemblies),
    trees: createReducer(trees),
    fastas: createReducer(fastas),
  }),
  filter: createReducer(filter),
  header,
  hub: hub(createReducer),
  location,
  reference: createReducer(reference),
  tables: combineReducers({
    metadata: createReducer(metadata),
    resistanceProfile: createReducer(resistanceProfile),
  }),
  toast,
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
