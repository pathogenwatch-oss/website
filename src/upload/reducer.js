import { combineReducers } from 'redux';

import { UPLOAD_FETCH_ASSEMBLER_USAGE, UPLOAD_SETTING_CHANGED } from './actions';

import progress from './progress/reducer';
import previous from './previous/reducer';

function usage(state = null, action) {
  switch (action.type) {
    case UPLOAD_FETCH_ASSEMBLER_USAGE.SUCCESS:
      return action.payload.result;
    default:
      return state;
  }
}

function errorMessage(state = null, action) {
  switch (action.type) {
    case 'UPLOAD_ERROR_MESSAGE':
      return action.payload;
    default:
      return state;
  }
}

function settings(state = { compression: false, individual: false }, { type, payload }) {
  switch (type) {
    case UPLOAD_SETTING_CHANGED: {
      return {
        ...state,
        [payload.setting]: payload.value,
      };
    }
    default:
      return state;
  }
}

export default combineReducers({
  progress,
  previous,
  errorMessage,
  usage,
  settings,
});
