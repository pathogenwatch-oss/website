import { MAP_STORE_BOUNDS, MAP_LASSO_CHANGE } from './actions';

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
    default:
      return state;
  }
}
