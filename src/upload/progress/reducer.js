import { combineReducers } from 'redux';

import * as actions from './actions';
import { UPLOAD_ADD_GENOMES } from '../actions';

import { views } from '../constants';

import assembly from './assembly/reducer';
import analysis from './analysis/reducer';
import files from './files/reducer';
import recovery from './recovery/reducer';

const initialState = {
  uploadedAt: null,
  view: null,
  settings: {
    compression: false,
    individual: false,
  },
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
        uploadedAt: payload.uploadedAt,
        view: incomplete ? views.RECOVERY : views.PROGRESS,
      };
    }

    case actions.UPLOAD_SETTING_CHANGED: {
      return {
        ...state,
        settings: {
          ...state.settings,
          [payload.setting]: payload.value,
        },
      };
    }

    default:
      return state;
  }
}

function resettable(reducer) {
  const _initialState = reducer(undefined, {});
  return function (state, action) {
    if (action.type === actions.UPLOAD_RESET) {
      return _initialState;
    }
    return reducer(state, action);
  };
}

const reducer = combineReducers({
  _,
  analysis,
  assembly,
  files,
  recovery,
});

export default resettable(reducer);
