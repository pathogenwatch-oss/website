import { combineReducers } from 'redux';

import collection from './collection';
import assemblies from './assemblies';

import { reducer as viewer } from '../../collection-viewer';

export default combineReducers({
  entities: combineReducers({
    assemblies,
    collection,
  }),
  viewer,
});
