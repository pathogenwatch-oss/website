import { GENOMES_FILTER_OPENED, GENOMES_FILTER_SUMMARY_LIST } from './actions';

const initialState = {
  isOpen: true,
  listFilters: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GENOMES_FILTER_OPENED:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case GENOMES_FILTER_SUMMARY_LIST:
      return {
        ...state,
        listFilters: {
          ...state[payload.stateKey],
          [payload.filterKey]: payload.text,
        },
      };
    default:
      return state;
  }
}
