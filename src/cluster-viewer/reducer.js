import {
  CLUSTER_TOGGLE_LASSO_ACTIVE,
  CLUSTER_SET_LASSO_PATH,
} from './actions';
import { CLEAR_FILTERS } from '../collection-viewer/filter/actions';

const initialState = {
  lassoActive: false,
  lassoPath: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case CLUSTER_TOGGLE_LASSO_ACTIVE:
      return {
        ...state,
        lassoActive: !state.lassoActive,
        lassoPath: initialState.lassoPath,
      };

    case CLUSTER_SET_LASSO_PATH:
      return {
        ...state,
        lassoPath: payload,
        lassoActive: payload !== null,
      };

    case CLEAR_FILTERS:
      return {
        ...state,
        lassoPath: initialState.lassoPath,
        lassoActive: initialState.lassoActive,
      };

    default:
      return state;
  }
}
