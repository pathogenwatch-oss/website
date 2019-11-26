import { GENOMES_FILTER_OPENED, GENOMES_FILTER_SUMMARY_LIST } from './actions';
import { UPDATE_FILTER, SET_FILTER } from '~/filter/actions';
import { stateKey } from '../filter';

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
          ...state,
          [payload.filterKey]: payload.text,
        },
      };
    case UPDATE_FILTER:
    case SET_FILTER: {
      if (payload.stateKey === stateKey) {
        return {
          ...state,
          listFilters: {},
        };
      }
      return state;
    }
    default:
      return state;
  }
}
