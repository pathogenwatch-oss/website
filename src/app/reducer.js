import { combineReducers } from 'redux';

import { reducer as assemblyDrawer } from '../assembly-drawer';
import { assemblies, collection, reference } from '../collection-route/reducers';
import collectionViewer from '../collection-viewer/reducer';
import filter from '../filter';
import { reducer as header } from '../header';
import hub from '../hub/reducers';
import fastas from '../hub/reducers/fastas';
import { reducer as map } from '../map';
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
    fastas: createReducer(fastas),
  }),
  filter,
  header,
  hub: hub(createReducer),
  location,
  map,
  reference: createReducer(reference),
  toast,
});
