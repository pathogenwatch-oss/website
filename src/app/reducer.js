import { combineReducers } from 'redux';

import { reducer as account } from '../account';
import { reducer as collections } from '../collections';
import { reducer as downloads } from '../downloads';
import { reducer as filters } from '../filter';
import { reducer as genomeDrawer } from '../genome-drawer';
import { reducer as genomes } from '../genomes';
import { reducer as header } from '../header';
import { reducer as location } from '../location/';
import { reducer as maps } from '../map';
import { reducer as offline } from '../offline';
import { reducer as organisms } from '../organisms';
import { reducer as toast } from '../toast';
import { reducer as summary } from '../summary';
import { reducer as viewer } from '../collection-viewer';
import { reducer as upload } from '../upload';

export default combineReducers({
  account,
  collections,
  downloads,
  filters,
  header,
  genomeDrawer,
  genomes,
  location,
  maps,
  offline,
  organisms,
  toast,
  summary,
  upload,
  viewer,
});
