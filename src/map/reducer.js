import { MAP_STORE_BOUNDS, MAP_LASSO_CHANGE, MAP_GROUP_MARKERS } from './actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case MAP_STORE_BOUNDS:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          bounds: payload.bounds,
        },
      };
    case MAP_LASSO_CHANGE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          lassoPath: payload.path,
        },
      };
    case MAP_GROUP_MARKERS:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          group: payload.group,
        },
      };
    default:
      return state;
  }
}
