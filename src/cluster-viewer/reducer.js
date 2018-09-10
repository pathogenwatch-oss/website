import { CLUSTER_SET_LASSO_PATH, CLUSTER_SELECT_NODES } from './actions';

const initialState = {
  lassoPath: null,
  selectedNodes: [],
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case CLUSTER_SET_LASSO_PATH:
      return {
        ...state,
        lassoPath: payload,
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

    default:
      return state;
  }
}
