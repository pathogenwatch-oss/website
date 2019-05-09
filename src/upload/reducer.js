import { combineReducers } from 'redux';

import { UPLOAD_FETCH_ASSEMBLER_USAGE } from './actions';

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

export default combineReducers({
  progress,
  previous,
  errorMessage,
  usage,
});
