import { combineReducers } from 'redux';

import collection from './collection';
import genomes from '../genomes/reducer';

import aboutCollectionOpen from '../about-collection/reducer';
import downloads from '../downloads/reducer';
import filter from '../filter/reducer';
import highlight from '../highlight/reducer';
import history from './history';
import metadata from '../private-metadata/reducer';
import offline from '../offline/reducer';
import search from '../search/reducer';
import summary from '../summary/reducer';
import table from '../table/reducer';
import timeline from '../timeline/reducer';
import tree from '../tree/reducer';

import clusterView from '~/cluster-viewer/reducer';

import { RESET_COLLECTION_VIEW } from '../actions';

const reducer = combineReducers({
  entities: combineReducers({
    genomes,
    collection,
  }),
  aboutCollectionOpen,
  clusterView,
  downloads,
  filter,
  highlight,
  history,
  metadata,
  offline,
  search,
  summary,
  table,
  timeline,
  tree,
});

const initialState = reducer(undefined, {});

export default function (state, action) {
  if (action.type === RESET_COLLECTION_VIEW) {
    return initialState;
  }
  return reducer(state, action);
}
