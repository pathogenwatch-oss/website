import { combineReducers } from 'redux';

import filter from './filter/reducer';
import summary from './summary/reducer';

export default combineReducers({
  filter,
  summary,
});
