import { combineReducers } from 'redux';

import filter from './filter';
import uploads from './uploads';
import { bounds, lassoPath } from './map';

import { CREATE_COLLECTION, SHOW_METRIC } from '../actions';

const loading = {
  initialState: false,
  actions: {
    [CREATE_COLLECTION.ATTEMPT]: () => true,
    [CREATE_COLLECTION.SUCCESS]: () => false,
    [CREATE_COLLECTION.FAILURE]: () => false,
  },
};

const selectedMetric = {
  initialState: 'totalNumberOfNucleotidesInDnaStrings',
  actions: {
    [SHOW_METRIC](state, { metric }) {
      return metric;
    },
  },
};

export default createReducer =>
  combineReducers({
    uploads: createReducer(uploads),
    loading: createReducer(loading),
    filter: createReducer(filter),
    selectedMetric: createReducer(selectedMetric),
    map: combineReducers({
      bounds: createReducer(bounds),
      lassoPath: createReducer(lassoPath),
    }),
  });
