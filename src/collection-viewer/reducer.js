import { combineReducers } from 'redux';

import filter from '../collection-viewer/filter/reducer';
import map from '../collection-viewer/map/reducer';

export default combineReducers({
  filter,
  map,
});
