import { combineReducers } from 'redux';

import progress from './progress/reducer';
import instructions from './instructions/reducer';

export default combineReducers({
  progress,
  instructions,
});
