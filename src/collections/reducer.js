import { combineReducers } from 'redux';

import { FETCH_COLLECTIONS, FETCH_COLLECTION_SUMMARY } from './actions';

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTIONS.SUCCESS: {
      return payload.result.reduce((memo, collection) => {
        memo[collection.id] = {
          ...collection,
        };
        return memo;
      }, {});
    }
    default:
      return state;
  }
}

const initialSummary = { total: 0, speciesId: {}, owner: {} };
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
