import { UPDATE_FILTER, CLEAR_FILTER } from './actions';

function applyFilterValue(state = {}, payload) {
  const { filterKey, filterValue } = payload;

  if (filterKey === 'prefilter') {
    return {
      [filterKey]: filterValue,
    };
  }

  return {
    ...state,
    [filterKey]: filterValue === state[filterKey] ? null : filterValue,
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
    case CLEAR_FILTER:
      return {
        ...state,
        [payload.stateKey]: {
          prefilter: state.prefilter,
        },
      };
    default:
      return state;
  }
}
