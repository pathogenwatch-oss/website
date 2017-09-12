import { combineReducers } from 'redux';

import filter from './filter/reducer';

import { FETCH_COLLECTIONS, FETCH_COLLECTION_SUMMARY } from './actions';

import { statuses } from './constants';

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTIONS.SUCCESS: {
      return payload.result.reduce((memo, collection) => {
        memo[collection.id] = {
          ...collection,
          createdAt: new Date(collection.createdAt),
        };
        return memo;
      }, {});
    }
    case FETCH_COLLECTIONS.FAILURE:
      return {};
    default:
      return state;
  }
}

const initialSummary = { total: 0, organismId: {}, owner: {} };
function summary(state = initialSummary, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION_SUMMARY.ATTEMPT:
      return { ...state, loading: true };
    case FETCH_COLLECTION_SUMMARY.SUCCESS:
      return { ...state, loading: false, ...payload.result };
    default:
      return state;
  }
}

function status(state = statuses.LOADING, { type }) {
  switch (type) {
    case FETCH_COLLECTIONS.ATTEMPT:
      return statuses.LOADING;
    case FETCH_COLLECTIONS.SUCCESS:
      return statuses.SUCCESS;
    case FETCH_COLLECTIONS.FAILURE:
      return statuses.ERROR;
    default:
      return state;
  }
}

export default combineReducers({
  entities,
  filter,
  status,
  summary,
});
