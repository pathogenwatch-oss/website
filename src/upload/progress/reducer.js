import { combineReducers } from 'redux';

import * as actions from './actions';
import { ADD_GENOMES } from '../actions';

import { views } from '../constants';

import assembly from './assembly/reducer';
import analysis from './analysis/reducer';
import files from './files/reducer';
import recovery from './recovery/reducer';

const initialState = {
  uploadedAt: null,
  view: null,
};

function _(state = initialState, { type, payload }) {
  switch (type) {
    case ADD_GENOMES.SUCCESS:
    case 'UPLOAD_RECOVER_SESSION': {
      return {
        ...initialState,
        view: views.PROGRESS,
      };
    }

    case actions.UPLOAD_FETCH_GENOMES.ATTEMPT: {
      if (state.uploadedAt === payload.uploadedAt) return state;
      return {
        ...state,
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

    default:
      return state;
  }
}

export default combineReducers({
  _,
  analysis,
  assembly,
  files,
  recovery,
});
