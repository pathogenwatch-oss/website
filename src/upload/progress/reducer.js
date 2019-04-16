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
      return {
        ...initialState,
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

export default combineReducers({
  _: resettable(_),
  analysis: resettable(analysis),
  assembly: resettable(assembly),
  files,
  recovery: resettable(recovery),
});
