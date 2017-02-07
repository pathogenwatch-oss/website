import { combineReducers } from 'redux';

import { FETCH_COLLECTIONS } from './actions';

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTIONS.SUCCESS: {
      return payload.result.reduce((memo, collection) => {
        memo[collection.id] = {
          ...collection,
        };
        return memo;
      }, { ...state });
    }
    default:
      return state;
  }
}

export default combineReducers({
  entities,
});
