import {
  SEARCH_DROPDOWN_VISIBILITY,
  SEARCH_TEXT_CHANGED,
  SEARCH_ITEM_SELECTED,
  SEARCH_ITEM_REMOVED,
  SEARCH_CURSOR_MOVED,
} from './actions.js';

import { RESET_FILTER } from '../filter/actions';

import { createSearchTerm } from './utils';

const initialState = {
  visible: false,
  text: '',
  terms: new Set(),
  category: null,
  cursor: 0,
  recent: new Set(),
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
    case SEARCH_ITEM_SELECTED: {
      if (state.category === null) {
        return {
          ...state,
          category: payload.item,
          text: '',
          cursor: 0,
        };
      }
      const term = createSearchTerm(state.category, payload.item);
      return {
        ...state,
        category: null,
        terms: new Set([ ...state.terms, term ]),
        text: '',
        cursor: 0,
      };
    }
    case SEARCH_ITEM_REMOVED: {
      if (payload.item) {
        const terms = state.terms;
        terms.delete(payload.item);
        return {
          ...state,
          terms: new Set(terms),
          recent: new Set([ payload.item, ...state.recent ].slice(0, 3)),
          text: '',
          cursor: 0,
        };
      }
      if (state.category) {
        return {
          ...state,
          category: null,
          text: '',
          cursor: 0,
        };
      }
      const terms = Array.from(state.terms);
      return {
        ...state,
        terms: new Set(terms.slice(0, -1)),
        recent: new Set([ terms[terms.length - 1], ...state.recent ].slice(0, 3)),
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
        recent: new Set([ ...Array.from(state.terms).reverse(), ...state.recent ].slice(0, 3)),
      };
    default:
      return state;
  }
}
