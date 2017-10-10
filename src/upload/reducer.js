import { combineReducers } from 'redux';

import progress from './progress/reducer';
import instructions from './instructions/reducer';
import previous from './previous/reducer';

export default combineReducers({
  progress,
  instructions,
  previous,
});
