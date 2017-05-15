import { combineReducers } from 'redux';

import { FETCH_COLLECTIONS, FETCH_COLLECTION_SUMMARY } from './actions';

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

export default combineReducers({
  entities,
  summary,
});
