import {
  SEARCH_DROPDOWN_VISIBILITY,
  SEARCH_TEXT_CHANGED,
  SEARCH_CATEGORY_SELECTED,
} from './actions.js';

const initialState = {
  visible: false,
  text: '',
  terms: [],
  category: null,
  cursor: 0,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SEARCH_DROPDOWN_VISIBILITY:
      return {
        ...state,
        visible: payload,
      };
    case SEARCH_TEXT_CHANGED:
      return {
        ...state,
        text: payload,
        cursor: 0,
      };
    case SEARCH_CATEGORY_SELECTED:
      return {
        ...state,
        category: payload.category,
        text: '',
        cursor: 0,
      };
    default:
      return state;
  }
}
