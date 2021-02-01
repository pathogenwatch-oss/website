import { combineReducers } from 'redux';

import filter from './filter/reducer';

import { FETCH_COLLECTIONS, FETCH_COLLECTION_SUMMARY } from './actions';

import { statuses } from './constants';

function indexResult(collections) {
  return collections.reduce((memo, collection) => {
    memo[collection.id] = {
      ...collection,
      createdAt: new Date(collection.createdAt),
    };
    return memo;
  }, {});
}

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION_SUMMARY.SUCCESS: {
      const { collections } = payload.result;
      return indexResult(collections);
    }
    case FETCH_COLLECTIONS.SUCCESS: {
      return indexResult(payload.result);
    }
    case FETCH_COLLECTION_SUMMARY.FAILURE:
    case FETCH_COLLECTIONS.FAILURE:
      return {};
    default:
      return state;
  }
}

const initialSummary = { total: 0, organismId: {}, type: {}, createdAt: {}, publicationYear: {} };
function summary(state = initialSummary, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION_SUMMARY.ATTEMPT:
      return { ...state, loading: true };
    case FETCH_COLLECTION_SUMMARY.SUCCESS:
      return { ...state, loading: false, ...payload.result.summary };
    default:
      return state;
  }
}

function status(state = statuses.LOADING, { type }) {
  switch (type) {
    case FETCH_COLLECTIONS.ATTEMPT:
    case FETCH_COLLECTION_SUMMARY.ATTEMPT:
      return statuses.LOADING;
    case FETCH_COLLECTIONS.SUCCESS:
    case FETCH_COLLECTION_SUMMARY.SUCCESS:
      return statuses.SUCCESS;
    case FETCH_COLLECTIONS.FAILURE:
    case FETCH_COLLECTION_SUMMARY.FAILURE:
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
