import * as actions from './actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case actions.MAP_STORE_BOUNDS:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          bounds: payload.bounds,
        },
      };
    case actions.MAP_LASSO_CHANGE:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          lassoPath: payload.path,
        },
      };
    case actions.MAP_VIEW_BY_COUNTRY:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          viewByCountry: payload.active,
        },
      };
    case actions.MAP_MARKER_SIZE_CHANGED:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          markerSize: payload.size,
        },
      };
    default:
      return state;
  }
}
