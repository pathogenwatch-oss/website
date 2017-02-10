import { combineReducers } from 'redux';

import aboutCollectionOpen from './about-collection/reducer';
import downloads from './downloads/reducer';
import filter from './filter/reducer';
import summary from './summary/reducer';
import tree from './tree/reducer';
import table from './table/reducer';

export default combineReducers({
  aboutCollectionOpen,
  downloads,
  filter,
  summary,
  tree,
  table,
});
