import { combineReducers } from 'redux';

import { reducer as viewer } from '../collection-viewer';
import { reducer as collections } from '../collections';
import { reducer as filters } from '../filter';
import { reducer as genomeDrawer } from '../genome-drawer';
import { reducer as genomes } from '../genomes';
import { reducer as header } from '../header';
import { reducer as location } from '../location/';
import { reducer as maps } from '../map';
import { reducer as toast } from '../toast';
import { reducer as summary } from '../summary';

export default combineReducers({
  genomeDrawer,
  viewer,
  collections,
  filters,
  header,
  genomes,
  location,
  maps,
  toast,
  summary,
});
