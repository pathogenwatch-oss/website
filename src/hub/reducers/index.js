import { combineReducers } from 'redux';

import filter from './filter';
import uploads from './uploads';
import { bounds, lassoPath } from './map';

import * as actions from '../actions';

const loading = {
  initialState: false,
  actions: {
    [actions.CREATE_COLLECTION.ATTEMPT]: () => true,
    [actions.CREATE_COLLECTION.SUCCESS]: () => false,
    [actions.CREATE_COLLECTION.FAILURE]: () => false,
  },
};

const selectedMetric = {
  initialState: 'totalNumberOfNucleotidesInDnaStrings',
  actions: {
    [actions.SHOW_METRIC](state, { metric }) {
      return metric;
    },
  },
};

const collectionMetadata = {
  initialState: { title: '', description: '' },
  actions: {
    [actions.CHANGE_COLLECTION_METADATA](state, payload) {
      return { ...state, ...payload };
    },
  },
};

export default createReducer =>
  combineReducers({
    uploads,
    loading: createReducer(loading),
    filter: createReducer(filter),
    selectedMetric: createReducer(selectedMetric),
    map: combineReducers({
      bounds: createReducer(bounds),
      lassoPath: createReducer(lassoPath),
    }),
    collectionMetadata: createReducer(collectionMetadata),
  });
