import {
  CLUSTER_TOGGLE_LASSO_ACTIVE,
  CLUSTER_SET_LASSO_PATH,
} from './actions';
import { RESET_FILTER } from '../collection-viewer/filter/actions';

import { filterKeys } from '../collection-viewer/filter/constants';

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

    case RESET_FILTER: {
      if (payload.key === filterKeys.VISIBILITY) {
        return {
          ...state,
          lassoPath: initialState.lassoPath,
          lassoActive: initialState.lassoActive,
        };
      }
      return state;
    }

    default:
      return state;
  }
}
