import { combineReducers } from 'redux';

import * as actions from './actions';

import { views } from '../constants';

import files from './files/reducer';
import analysis from './analysis/reducer';

const initialState = {
  uploadedAt: null,
  view: null,
};

function _(state = initialState, { type, payload }) {
  switch (type) {
    case actions.UPLOAD_FETCH_GENOMES.ATTEMPT: {
      if (state.uploadedAt === payload.uploadedAt) return state;
      return {
        ...initialState,
        uploadedAt: payload.uploadedAt,
      };
    }
    case actions.UPLOAD_FETCH_GENOMES.SUCCESS: {
      const { genomes } = payload.result;
      let incomplete = false;
      for (const genome of genomes) {
        if (genome.files) {
          incomplete = true;
          break;
        }
      }
      return {
        ...state,
        view: incomplete ? views.RECOVERY : views.PROGRESS,
      };
    }
    case 'ASSEMBLY_PIPELINE_STATUS':
      return {
        ...state,
        assemblyProgress: payload,
      };
    case 'ASSEMBLY_PROGRESS_TICK':
      return {
        ...state,
        assemblyTick: Date.now(),
      };
    case 'UPLOAD_RECOVER_SESSION': {
      return {
        ...initialState,
        view: views.PROGRESS,
      };
    }
    default:
      return state;
  }
}

export default combineReducers({
  _,
  files,
  analysis,
});
