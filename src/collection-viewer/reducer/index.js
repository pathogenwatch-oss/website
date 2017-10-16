import { combineReducers } from 'redux';

import collection from './collection';
import genomes from './genomes';
import position from './position';

import aboutCollectionOpen from '../about-collection/reducer';
import downloads from '../downloads/reducer';
import filter from '../filter/reducer';
import summary from '../summary/reducer';
import tree from '../tree/reducer';
import table from '../table/reducer';
import offline from '../offline/reducer';
import search from '../search/reducer';

import { RESET_COLLECTION_VIEW } from '../actions';

const reducer = combineReducers({
  entities: combineReducers({
    genomes,
    collection,
    position,
  }),
  aboutCollectionOpen,
  downloads,
  filter,
  summary,
  tree,
  table,
  offline,
  search,
});

const initialState = reducer(undefined, {});

export default function (state, action) {
  if (action.type === RESET_COLLECTION_VIEW) {
    return initialState;
  }
  return reducer(state, action);
}
