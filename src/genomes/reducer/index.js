import { combineReducers } from 'redux';

import uploads from './uploads';
import entities from './entities';

import { CREATE_COLLECTION, CHANGE_COLLECTION_METADATA } from '../create-collection-drawer';
import { SHOW_METRIC, FETCH_GENOME_SUMMARY } from '../actions';

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

const initialSummary = { speciesId: {}, country: {}, reference: {}, owner: {} };
function summary(state = initialSummary, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_SUMMARY.ATTEMPT:
      return { ...state, loading: true };
    case FETCH_GENOME_SUMMARY.SUCCESS:
      return { ...state, loading: false, ...payload.result };
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  collectionMetadata,
  loading,
  selectedMetric,
  uploads,
  summary,
});
