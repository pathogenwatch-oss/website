import { UPDATE_FILTER, CLEAR_FILTER } from './actions';

function applyFilterValue(state = {}, payload) {
  const { filterKey, filterValue } = payload;
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
        [payload.stateKey]: {},
      };
    default:
      return state;
  }
}
