import { combineReducers } from 'redux';

import filter from './filter/reducer';
import tree from './tree/reducer';
import table from './table/reducer';
import aboutCollectionOpen from './about-collection/reducer';

export default combineReducers({
  filter,
  tree,
  table,
  aboutCollectionOpen,
});
