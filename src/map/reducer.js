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
    case 'SET_GENOME_SELECTION':
      if (payload.genomes.length) return state;
      return Object.keys(state).reduce((memo, stateKey) => {
        const currentState = state[stateKey];
        memo[stateKey] =
          stateKey.indexOf('GENOME') === 0 ? {
            ...currentState,
            lassoPath: null,
          } : currentState;
        return memo;
      }, {});
    default:
      return state;
  }
}
