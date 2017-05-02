import { combineReducers } from 'redux';

import { statuses } from './constants';

import { FETCH_ACCOUNT_ACTIVITY } from './actions';

function activity(state = null, { type }) {
  switch (type) {
    case FETCH_ACCOUNT_ACTIVITY.ATTEMPT:
      return statuses.LOADING;
    case FETCH_ACCOUNT_ACTIVITY.FAILURE:
      return statuses.ERROR;
    case FETCH_ACCOUNT_ACTIVITY.SUCCESS:
      return statuses.LOADED;
    default:
      return state;
  }
}

function entities(state = {}, { type, payload }) {
  switch (type) {
    case FETCH_ACCOUNT_ACTIVITY.SUCCESS:
      return {
        activity:
          payload.result.map(item => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleString(),
          })),
      };
    default:
      return state;
  }
}

export default combineReducers({
  activity,
  entities,
});
