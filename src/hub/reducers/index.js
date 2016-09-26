import { combineReducers } from 'redux';

import filter from './filter';
import uploads from './uploads';

import { CREATE_COLLECTION } from '../actions';

const loading = {
  initialState: false,
  actions: {
    [CREATE_COLLECTION.ATTEMPT]: () => true,
    [CREATE_COLLECTION.SUCCESS]: () => false,
    [CREATE_COLLECTION.FAILURE]: () => false,
  },
};

export default createReducer =>
  combineReducers({
    uploads: createReducer(uploads),
    loading: createReducer(loading),
    filter: createReducer(filter),
  });
