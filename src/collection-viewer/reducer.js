import { combineReducers } from 'redux';

import filter from './filter/reducer';
import tree from './tree/reducer';

export default combineReducers({
  filter,
  tree,
});
