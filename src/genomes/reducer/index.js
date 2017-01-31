import { combineReducers } from 'redux';

import uploads from './uploads';
import fastas from './fastas';

import { CREATE_COLLECTION, CHANGE_COLLECTION_METADATA } from '../create-collection-drawer';
import { SHOW_METRIC } from '../actions';

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

export default combineReducers({
  entities: combineReducers({
    fastas,
  }),
  uploads,
  loading,
  selectedMetric,
  collectionMetadata,
});
