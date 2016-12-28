import { COLLECTION_SUMMARY_TOGGLE } from './actions';

const initialState = {
  isExpanded: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case COLLECTION_SUMMARY_TOGGLE: {
      return {
        ...state,
        isExpanded: payload,
      };
    }
    default:
      return state;
  }
}
