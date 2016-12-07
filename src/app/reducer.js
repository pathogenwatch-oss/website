import { combineReducers } from 'redux';

import { reducer as assemblyDrawer } from '../assembly-drawer';
import { assemblies, collection, reference } from '../collection-route/reducers';
import collectionViewer from '../collection-viewer/reducer';
import filters from '../filter';
import { reducer as header } from '../header';
import { reducer as hub } from '../hub';
import { reducer as maps } from '../map';
import { reducer as location } from '../location/';
import { reducer as toast } from '../toast';

function createReducer({ actions, initialState }) {
  return function (state = initialState, action) {
    if (actions[action.type]) {
      return actions[action.type](state, action.payload || action);
    }
    return state;
  };
}

export default combineReducers({
  assemblyDrawer,
  collection: createReducer(collection),
  collectionViewer,
  entities: combineReducers({
    assemblies: createReducer(assemblies),
  }),
  filters,
  header,
  hub,
  location,
  maps,
  reference: createReducer(reference),
  toast,
});
