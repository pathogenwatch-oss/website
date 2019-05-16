import { combineReducers } from 'redux';

import * as actions from './actions';
import { UPLOAD_ADD_GENOMES } from '../actions';

import { views } from '../constants';

import analysis from './analysis/reducer';
import assembly from './assembly/reducer';
import files from './files/reducer';
import genomes from './genomes/reducer';
import recovery from './recovery/reducer';

const initialState = {
  uploadedAt: null,
  view: null,
  showFailures: false,
};

function _(state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS:
      return {
        ...state,
        view: views.PROGRESS,
        uploadedAt: payload.uploadedAt || state.uploadedAt,
      };

    case actions.UPLOAD_FETCH_GENOMES.SUCCESS: {
      if (state.uploadedAt === payload.uploadedAt) return state;
      const { result } = payload;
      let incomplete = false;
      for (const genome of result.genomes) {
        if (genome.files) {
          incomplete = true;
          break;
        }
      }
      return {
        ...state,
        uploadedAt: payload.uploadedAt,
        view: incomplete ? views.RECOVERY : views.PROGRESS,
      };
    }

    case actions.UPLOAD_TOGGLE_ERRORS:
      return {
        ...state,
        showFailures: !state.showFailures,
      };

    default:
      return state;
  }
}

const reducer = combineReducers({
  _,
  analysis,
  assembly,
  files,
  genomes,
  recovery,
});

const _initialState = reducer(undefined, {});
export default function (state = _initialState, action) {
  if (action.type === actions.UPLOAD_RESET) {
    return _initialState;
  }
  return reducer(state, action);
}
