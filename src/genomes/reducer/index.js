import { combineReducers } from 'redux';

import uploads from '../uploads/reducer';
import entities from './entities';
import summary from '../summary/reducer';
import subselection from '../subselection/reducer';

import { CREATE_COLLECTION, CHANGE_COLLECTION_METADATA } from '../create-collection-drawer';
import { SHOW_METRIC, FETCH_GENOMES } from '../actions';

import { statuses } from '../constants';

function waiting(state = false, { type }) {
  switch (type) {
    case CREATE_COLLECTION.ATTEMPT:
      return true;
    case CREATE_COLLECTION.SUCCESS:
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

const initialStatus = null;
function status(state = initialStatus, { type }) {
  switch (type) {
    case FETCH_GENOMES.ATTEMPT:
      return statuses.LOADING;
    case FETCH_GENOMES.FAILURE:
      return statuses.ERROR;
    case FETCH_GENOMES.SUCCESS:
      return statuses.OK;
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  collectionMetadata,
  selectedMetric,
  status,
  subselection,
  summary,
  uploads,
  waiting,
});
