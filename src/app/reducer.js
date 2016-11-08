import { combineReducers } from 'redux';

import aboutCollectionOpen from '../about-collection-dropdown/reducer';
import antibiotics from '../reducers/antibiotics';
import { reducer as assemblyDrawer } from '../assembly-drawer';
import bodyClickListener from '../reducers/bodyClickListener';
import { assemblies, collection, reference } from '../reducers/collection';
import collectionFilter from '../collection-viewer/filter/reducer';
import downloads from '../reducers/downloads';
import downloadsMenu from '../reducers/downloadsMenu';
import filter from '../filter';
import { reducer as header } from '../header';
import hub from '../hub/reducers';
import fastas from '../hub/reducers/fastas';
import metadata from '../reducers/metadata';
import { reducer as location } from '../location/';
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
  assemblyDrawer,
  bodyClickListener,
  collection: createReducer(collection),
  collectionFilter: createReducer(collectionFilter),
  display: combineReducers({
    table: createReducer(table),
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
  filter,
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
