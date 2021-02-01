import { combineReducers } from 'redux';

import account from '../account/reducer';
import auth from '../auth/reducer';
import branding from '../branding/reducer';
import clustering from '../clustering/reducer';
import collections from '../collections/reducer';
import downloads from '../downloads/reducer';
import filters from '../filter/reducer';
import genomes from '../genomes/reducer';
import header from '../header/reducer';
import location from '../location/reducer';
import maps from '../map/reducer';
import offline from '../offline/reducer';
import organisms from '../organisms/reducer';
import toast from '../toast/reducer';
import summary from '../summary/reducer';
import viewer from '../collection-viewer/reducer';
import upload from '../upload/reducer';

export default combineReducers({
  account,
  auth,
  branding,
  clustering,
  collections,
  downloads,
  filters,
  header,
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
