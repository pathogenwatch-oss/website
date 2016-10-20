import { LOCATION_CHANGE } from '../location';

export default (actionTypes, filters) => {
  const initialState =
    filters.reduce((memo, { key }) => ({ ...memo, [key]: null }), {});

  return function (state = initialState, { type, payload }) {
    switch (type) {
      case actionTypes.UPDATE_FILTER:
        return {
          ...state,
          [payload.key]:
            payload.value === state[payload.key] ? null : payload.value,
        };
      case actionTypes.CLEAR_FILTER:
        return initialState;
      case LOCATION_CHANGE:
        return {
          ...state,
          ...filters.reduce((memo, { key, onLocationChange }) => {
            if (!onLocationChange) return memo;
            memo[key] = onLocationChange(state[key], payload.location);
            return memo;
          }, {}),
        };
      default:
        return state;
    }
  };
};
