import {
  SEARCH_DROPDOWN_VISIBILITY,
  SEARCH_TEXT_CHANGED,
  SEARCH_CATEGORY_SELECTED,
  SEARCH_TERM_ADDED,
  SEARCH_TERM_REMOVED,
  SEARCH_CURSOR_MOVED,
} from './actions.js';

import { RESET_FILTER } from '../filter/actions';

const initialState = {
  visible: false,
  text: '',
  terms: new Set(),
  category: null,
  cursor: 0,
  recent: new Set(),
};

function addToRecent(state, terms) {
  return new Set([ ...terms, ...state.recent ].slice(0, 3));
}

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
    case SEARCH_TERM_ADDED: {
      state.recent.delete(payload);
      return {
        ...state,
        category: null,
        terms: new Set([ payload, ...state.terms ]),
        recent: new Set(state.recent),
        text: '',
        cursor: 0,
      };
    }
    case SEARCH_TERM_REMOVED: {
      state.terms.delete(payload);
      return {
        ...state,
        terms: new Set(state.terms),
        recent: addToRecent(state, [ payload ]),
        text: '',
        cursor: 0,
      };
    }
    case SEARCH_CURSOR_MOVED:
      return {
        ...state,
        cursor: Math.max(0, state.cursor + payload.delta),
      };
    case RESET_FILTER:
      return {
        ...state,
        terms: new Set(),
        recent: addToRecent(state, state.terms),
      };
    default:
      return state;
  }
}
