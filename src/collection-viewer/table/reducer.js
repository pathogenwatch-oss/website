import { combineReducers } from 'redux';

import { metadata, typing, stats } from '../data-tables';
import { antibiotics, snps, genes } from '../../reducers/resistanceProfile';

import { FETCH_ENTITIES } from '../../actions/fetch';
import { SET_TABLE } from './actions';

import { getInitialTable } from '../data-tables/utils';

import { tableKeys, dataTables, amrTables } from './constants';

function visible(state = tableKeys.metadata, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS:
      return getInitialTable(payload.result);
    case SET_TABLE:
      return payload.name;
    default:
      return state;
  }
}

function activeData(state = tableKeys.metadata, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS:
      return getInitialTable(payload.result);
    case SET_TABLE:
      return dataTables.has(payload.name) ? payload.name : state;
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
  activeData,
});
