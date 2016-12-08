import { combineReducers } from 'redux';

import collection from './collection';
import assemblies from './assemblies';

import { reducer as viewer } from '../../collection-viewer';

import { RESET_COLLECTION_VIEW } from '../actions';

const reducer = combineReducers({
  entities: combineReducers({
    assemblies,
    collection,
  }),
  viewer,
});

const initialState = reducer(undefined, {});

export default function (state, action) {
  if (action.type === RESET_COLLECTION_VIEW) {
    return initialState;
  }
  return reducer(state, action);
}
