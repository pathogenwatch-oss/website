import {
  CLUSTER_TOGGLE_LASSO_ACTIVE,
  CLUSTER_SET_LASSO_PATH,
  CLUSTER_SELECT_NODES,
} from './actions';
import { RESET_FILTER } from '../collection-viewer/filter/actions';

import { filterKeys } from '../collection-viewer/filter/constants';

const initialState = {
  lassoActive: false,
  lassoPath: null,
  selectedNodes: [],
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

    case CLUSTER_SELECT_NODES: {
      if (payload.append) {
        return {
          ...state,
          selectedNodes: Array.from(
            new Set([
              ...state.selectedNodes,
              ...payload.ids,
            ])
          ),
        };
      }
      return {
        ...state,
        selectedNodes: payload.ids || [],
      };
    }

    case RESET_FILTER: {
      if (payload.key === filterKeys.HIGHLIGHT) {
        return {
          ...state,
          selectedNodes: initialState.selectedNodes,
        };
      }
      return {
        ...state,
        lassoPath: initialState.lassoPath,
        lassoActive: initialState.lassoActive,
      };
    }

    default:
      return state;
  }
}
