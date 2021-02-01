import { COLLECTIONS_FILTER_OPENED } from './actions';

const initialState = {
  isOpen: true,
};

export default function (state = initialState, { type }) {
  switch (type) {
    case COLLECTIONS_FILTER_OPENED:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    default:
      return state;
  }
}
