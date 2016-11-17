import { combineReducers } from 'redux';

import filter from './filter/reducer';
import summary from './summary/reducer';
import tree from './tree/reducer';

export default combineReducers({
  filter,
  summary,
  tree,
});
