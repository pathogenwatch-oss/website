import { UPDATE_FILTER, SET_FILTER, CLEAR_FILTER } from './actions';

function applyFilterValue(state = {}, payload) {
  const { query } = payload;

  if (Object.keys(query).length === 1 && query.prefilter) {
    return {
      ...query,
    };
  }

  return {
    ...state,
    ...Object.keys(query).reduce((memo, key) => {
      const value = query[key];
      memo[key] = value === state[key] ? undefined : value;
      return memo;
    }, {}),
  };
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case UPDATE_FILTER:
      return {
        ...state,
        [payload.stateKey]:
          applyFilterValue(state[payload.stateKey], payload),
      };
    case SET_FILTER:
      return {
        ...state,
        [payload.stateKey]: {
          ...payload.query,
        },
      };
    case CLEAR_FILTER: {
      const { prefilter } = state[payload.stateKey];
      return {
        ...state,
        [payload.stateKey]: {
          prefilter,
        },
      };
    }
    default:
      return state;
  }
}
