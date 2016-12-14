import { combineReducers } from 'redux';

import { reducer as assemblyDrawer } from '../assembly-drawer';
import { reducer as collection } from '../collection-route';
import { reducer as filters } from '../filter';
import { reducer as header } from '../header';
import { reducer as hub } from '../hub';
import { reducer as maps } from '../map';
import { reducer as location } from '../location/';
import { reducer as toast } from '../toast';

export default combineReducers({
  assemblyDrawer,
  collection,
  filters,
  header,
  hub,
  location,
  maps,
  toast,
});
