import { combineReducers } from 'redux';

import filter from './filter/reducer';
import summary from './summary/reducer';
import tree from './tree/reducer';
import table from './table/reducer';
import aboutCollectionOpen from './about-collection/reducer';

export default combineReducers({
  filter,
  summary,
  tree,
  table,
  aboutCollectionOpen,
});
