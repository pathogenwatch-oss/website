import * as actions from './actions';
import { FETCH_GENOME_LIST, FETCH_GENOME_SELECTION, FETCH_GENOME_SUMMARY } from '../actions';
import { CREATE_COLLECTION } from '~/genomes/create-collection-form';
import { getFormatted } from '~/organisms/OrganismName.react';

import { statuses } from '~/app/constants';

const initialState = {
  dropdown: null,
  genomes: {},
  download: {
    status: null,
    summary: null,
  },
  lastSelectedIndex: null,
};

const addToSelection = (memo, { id, name, organismId, analysis, binned }) => {
  const organismName = !!analysis && 'speciator' in analysis ?
    analysis.speciator.organismName :
    '';
  // eslint-disable-next-line no-param-reassign
  memo[id] = {
    id,
    name,
    organismId,
    organismName,
    organismLabel: getFormatted({ speciesName: organismName }),
    binned,
  };
  return memo;
};

const removeFromSelection = (memo, { id }) => {
  // eslint-disable-next-line no-param-reassign
  delete memo[id];
  return memo;
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.APPEND_GENOME_SELECTION:
      return {
        ...state,
        genomes: payload.genomes.reduce(addToSelection, { ...state.genomes }),
        lastSelectedIndex:
          typeof payload.index === 'number'
            ? payload.index
            : state.lastSelectedIndex,
      };
    case actions.REMOVE_GENOME_SELECTION:
      return {
        ...state,
        genomes: payload.genomes.reduce(removeFromSelection, {
          ...state.genomes,
        }),
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
    case FETCH_GENOME_SELECTION.SUCCESS:
    case FETCH_GENOME_SELECTION.ERROR:
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
    case 'SEND_METADATA_UPDATE::SUCCESS': {
      const { data } = payload;
      const updates = {};
      for (const { id, name } of data) {
        if (id in state.genomes && state.genomes[id].name !== name) {
          updates[id] = {
            ...state.genomes[id],
            name,
          };
        }
      }
      if (Object.keys(updates).length) {
        return {
          ...state,
          genomes: {
            ...state.genomes,
            ...updates,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
}
