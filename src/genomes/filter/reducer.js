import { GENOMES_FILTER_OPENED } from './actions';

const initialState = {
  isOpen: true,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GENOMES_FILTER_OPENED:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    default:
      return state;
  }
}
