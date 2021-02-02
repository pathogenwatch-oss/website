import { FILTER_SUMMARY_LIST } from './actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FILTER_SUMMARY_LIST:
      return {
        ...state,
        [payload.stateKey]: {
          ...state[payload.stateKey],
          [payload.filterKey]: payload.text,
        },
      };
    default:
      return state;
  }
}
