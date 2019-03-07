import { combineReducers } from 'redux';

import progress from './progress/reducer';
import instructions from './instructions/reducer';
import previous from './previous/reducer';

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
  instructions,
  previous,
  errorMessage,
});
