import { combineReducers } from 'redux';

import summary from './summary/reducer';
import filter from './filter/reducer';
import selection from './selection/reducer';
import stats from './stats/reducer';
import collectionMetadata from './create-collection-form/reducer';
import map from './map/reducer';
import report from '../genome-report/reducer';

import { CREATE_COLLECTION } from './create-collection-form';
import * as actions from './actions';

import { statuses } from './constants';
import { messageToken } from "../../universal/constants";

function entities(state = {}, { type, payload }) {
  switch (type) {
    case actions.FETCH_GENOME_SELECTION.SUCCESS:
    case actions.FETCH_GENOME_LIST.SUCCESS: {
      const { prefilter } = payload.filter;
      return payload.result.reduce(
        (memo, genome) => {
          if (prefilter === 'bin') genome.binned = true;
          memo[genome.id] = genome;
          return memo;
        },
        { ...state }
      );
    }
    case actions.FETCH_GENOME_SUMMARY.SUCCESS: {
      const { prefilter } = payload.filter;
      return payload.result.genomes.reduce((memo, genome) => {
        if (prefilter === 'bin') genome.binned = true;
        memo[genome.id] = genome;
        return memo;
      }, {});
    }
    case 'SEND_METADATA_UPDATE::SUCCESS': {
      const { data } = payload;
      const { computedData } = payload.result;
      const updates = {};
      for (const { id, name } of data) {
        if (id in state) {
          updates[id] = {
            ...state[id],
            name,
            country: computedData[id].country,
            date: computedData[id].date,
          };
        }
      }
      if (Object.keys(updates).length) {
        return {
          ...state,
          ...updates,
        };
      }
      return state;
    }
    default:
      return state;
  }
}

function indices(state = {}, { type, payload }) {
  switch (type) {
    case actions.FETCH_GENOME_SUMMARY.SUCCESS: {
      return payload.result.genomes.reduce((memo, genome, index) => {
        memo[index] = genome.id;
        return memo;
      }, {});
    }
    case actions.FETCH_GENOME_LIST.ATTEMPT: {
      const { skip = 0, limit = 0 } = payload.options;
      const nextState = { ...state };
      for (let i = skip; i < skip + limit; i++) {
        nextState[i] = state[i] || true;
      }
      return nextState;
    }
    case actions.FETCH_GENOME_LIST.FAILURE: {
      const { skip = 0, limit = 0 } = payload.options;
      const nextState = { ...state };
      for (let i = skip; i < skip + limit; i++) {
        nextState[i] = undefined;
      }
      return nextState;
    }
    case actions.FETCH_GENOME_LIST.SUCCESS: {
      const { skip = 0 } = payload.options;
      return payload.result.reduce(
        (memo, genome, index) => {
          memo[index + skip] = genome.id;
          return memo;
        },
        { ...state }
      );
    }
    default:
      return state;
  }
}

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

function status(state = initialStatus, { type }) {
  switch (type) {
    case actions.FETCH_GENOME_SUMMARY.ATTEMPT:
    case actions.FETCH_GENOME_MAP.ATTEMPT:
    case actions.FETCH_GENOME_STATS.ATTEMPT:
      return statuses.LOADING;
    case actions.FETCH_GENOME_SUMMARY.FAILURE:
    case actions.FETCH_GENOME_MAP.FAILURE:
    case actions.FETCH_GENOME_STATS.FAILURE:
      return statuses.ERROR;
    case actions.FETCH_GENOME_SUMMARY.SUCCESS:
    case actions.FETCH_GENOME_MAP.SUCCESS:
    case actions.FETCH_GENOME_STATS.SUCCESS:
      return statuses.OK;
    default:
      return state;
  }
}

const initialErrorMsg = "";

function errorMsg(state = initialErrorMsg, { type, payload }) {
  switch (type) {
    case actions.FETCH_GENOME_SUMMARY.FAILURE:
    case actions.FETCH_GENOME_MAP.FAILURE:
    case actions.FETCH_GENOME_STATS.FAILURE:
      return payload.error.responseText.includes(messageToken) ?
        payload.error.responseText.split(messageToken)[1] :
        null;
    default:
      return state;
  }
}

export default combineReducers({
  filter,
  entities,
  indices,
  collectionMetadata,
  stats,
  status,
  selection,
  summary,
  waiting,
  map,
  report,
  errorMsg,
});
