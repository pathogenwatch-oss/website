import { combineReducers } from 'redux';

import summary from './summary/reducer';
import selection from './selection/reducer';
import selectedMetric from './stats/reducer';
import collectionMetadata from './create-collection-form/reducer';

import { CREATE_COLLECTION } from './create-collection-form';
import * as actions from './actions';

function entities(state = {}, { type, payload }) {
  switch (type) {
    case actions.FETCH_GENOMES.ATTEMPT:
      return {};
    case actions.FETCH_GENOMES.SUCCESS: {
      return payload.result.reduce((memo, genome) => {
        memo[genome.id] = genome;
        return memo;
      }, {});
    }
    case actions.FETCH_GENOME_SUMMARY.SUCCESS: {
      return payload.result.genomes.reduce((memo, genome) => {
        memo[genome.id] = genome;
        return memo;
      }, {});
    }
    default:
      return state;
  }
}

import { statuses } from './constants';

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

const initialStatus = null;
function status(state = initialStatus, { type, payload }) {
  switch (type) {
    case actions.FETCH_GENOME_SUMMARY.ATTEMPT: {
      return statuses.LOADING;
    }
    case actions.FETCH_GENOME_SUMMARY.FAILURE:
      return statuses.ERROR;
    case actions.FETCH_GENOME_SUMMARY.SUCCESS:
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
  selection,
  summary,
  waiting,
});
