import { combineReducers } from 'redux';

import uploads from './uploads';

import { CREATE_COLLECTION, CHANGE_COLLECTION_METADATA } from '../../hub-drawer';
import * as actions from '../actions';

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
    [actions.SHOW_METRIC](state, { metric }) {
      return metric;
    },
  },
};

const collectionMetadata = {
  initialState: { title: '', description: '' },
  actions: {
    [CHANGE_COLLECTION_METADATA](state, payload) {
      return { ...state, ...payload };
    },
  },
};

export default createReducer =>
  combineReducers({
    uploads,
    loading: createReducer(loading),
    selectedMetric: createReducer(selectedMetric),
    collectionMetadata: createReducer(collectionMetadata),
  });
