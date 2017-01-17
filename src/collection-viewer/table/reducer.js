import { combineReducers } from 'redux';

import { metadata, typing, stats } from '../data-tables';
import { antibiotics, snps, genes } from '../../reducers/resistanceProfile';

import { SET_TABLE } from './actions';

import { tableKeys, amrTables } from './constants';

function visible(state = tableKeys.metadata, { type, payload }) {
  switch (type) {
    case SET_TABLE:
      return payload.name;
    default:
      return state;
  }
}

function activeAMR(state = tableKeys.antibiotics, { type, payload }) {
  switch (type) {
    case SET_TABLE:
      return amrTables.has(payload.name) ? payload.name : state;
    default:
      return state;
  }
}

export default combineReducers({
  entities: combineReducers({
    metadata,
    typing,
    stats,
    antibiotics,
    snps,
    genes,
  }),
  visible,
  activeAMR,
});
