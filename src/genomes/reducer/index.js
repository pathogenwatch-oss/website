import { combineReducers } from 'redux';

import uploads from './uploads';
import entities from './entities';

import { CREATE_COLLECTION, CHANGE_COLLECTION_METADATA } from '../create-collection-drawer';
import { SHOW_METRIC, PREFILTER, FETCH_SUMMARY } from '../actions';

function loading(state = false, { type }) {
  switch (type) {
    case CREATE_COLLECTION.ATTEMPT:
      return true;
    case CREATE_COLLECTION.SUCCESS:
      return false;
    case CREATE_COLLECTION.FAILURE:
      return false;
    default:
      return state;
  }
}

const initialMetric = 'totalNumberOfNucleotidesInDnaStrings';
function selectedMetric(state = initialMetric, { type, payload }) {
  switch (type) {
    case SHOW_METRIC:
      return payload.metric;
    default:
      return state;
  }
}

const initialMetadata = { title: '', description: '' };
function collectionMetadata(state = initialMetadata, { type, payload }) {
  switch (type) {
    case CHANGE_COLLECTION_METADATA:
      return { ...state, ...payload };
    default:
      return state;
  }
}

const initialPrefilter = 'all';
function prefilter(state = initialPrefilter, { type, payload }) {
  switch (type) {
    case PREFILTER:
      return payload.name;
    default:
      return state;
  }
}

const initialSummary = {};
function summary(state = initialSummary, { type, payload }) {
  switch (type) {
    case FETCH_SUMMARY:
      return payload.result;
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  collectionMetadata,
  loading,
  prefilter,
  selectedMetric,
  uploads,
  summary,
});
