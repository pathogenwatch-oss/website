import { combineReducers } from 'redux';

import { metadata, typing, stats } from '../data-tables';
import { antibiotics, snps, genes, kleborateAMR, kleborateAMRGenotypes, vista } from '../amr-tables';
import report from '../../genome-report/reducer';

import { SET_TABLE, AMR_TOGGLE_MULTI } from './actions';
import {
  VIEWER_ADD_PRIVATE_METADATA,
  VIEWER_CLEAR_PRIVATE_METADATA,
} from '../private-metadata/actions';

import { dataTables, amrTables } from './constants';
import { tableKeys } from '../constants';

function visible(state = null, { type, payload }) {
  switch (type) {
    case SET_TABLE:
      return payload.name;
    case VIEWER_ADD_PRIVATE_METADATA:
      return tableKeys.metadata;
    case VIEWER_CLEAR_PRIVATE_METADATA:
      return state === tableKeys.metadata ? null : state;
    default:
      return state;
  }
}

function activeData(state = null, { type, payload }) {
  switch (type) {
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

function multi(state = false, { type }) {
  switch (type) {
    case AMR_TOGGLE_MULTI:
      return !state;
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
    kleborateAMR,
    kleborateAMRGenotypes,
    vista,
    report,
  }),
  visible,
  activeAMR,
  activeData,
  multi,
});
