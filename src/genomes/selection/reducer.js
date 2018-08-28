import * as actions from './actions';
import { FETCH_GENOME_LIST, FETCH_GENOME_SUMMARY } from '../actions';
import { CREATE_COLLECTION } from '../create-collection-form/actions';

import { statuses } from '../../app/constants';

const initialState = {
  dropdown: null,
  genomes: {},
  download: {
    status: null,
    summary: null,
  },
  lastSelectedIndex: null,
};

const addToSelection = (memo, { id, name, organismId, binned }) => {
  memo[id] = { id, name, organismId, binned };
  return memo;
};

const removeFromSelection = (memo, { id }) => {
  delete memo[id];
  return memo;
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.APPEND_GENOME_SELECTION:
      return {
        ...state,
        genomes: payload.genomes.reduce(addToSelection, { ...state.genomes }),
        lastSelectedIndex: typeof payload.index === 'number' ?
          payload.index :
          state.lastSelectedIndex,
      };
    case actions.REMOVE_GENOME_SELECTION:
      return {
        ...state,
        genomes: payload.genomes.reduce(removeFromSelection, { ...state.genomes }),
      };
    case actions.SET_GENOME_SELECTION: {
      return {
        ...state,
        genomes: payload.genomes.reduce(addToSelection, {}),
      };
    }
    case actions.SELECTION_DROPDOWN_OPENED:
      return {
        ...state,
        dropdown: payload === state.dropdown ? null : payload,
      };
    case FETCH_GENOME_LIST.SUCCESS:
    case FETCH_GENOME_LIST.ERROR:
    case CREATE_COLLECTION.SUCCESS:
      return {
        ...state,
        dropdown: null,
      };
    case actions.CLEAR_GENOME_SELECTION:
      return initialState;
    case actions.SELECTION_FETCH_DOWNLOADS.ATTEMPT:
      return {
        ...state,
        download: {
          ...state.download,
          status: statuses.LOADING,
        },
      };
    case actions.SELECTION_FETCH_DOWNLOADS.FAILURE:
      return {
        ...state,
        download: {
          ...state.download,
          status: statuses.ERROR,
        },
      };
    case actions.SELECTION_FETCH_DOWNLOADS.SUCCESS:
      return {
        ...state,
        download: {
          ...state.download,
          status: statuses.SUCCESS,
          summary: payload.result,
        },
      };
    case FETCH_GENOME_SUMMARY.ATTEMPT:
      return {
        ...state,
        lastSelectedIndex: null,
      };
    default:
      return state;
  }
}
