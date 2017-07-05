import {
  SEARCH_DROPDOWN_VISIBILITY,
  SEARCH_TEXT_CHANGED,
  SEARCH_CATEGORY_SELECTED,
  SEARCH_TERM_ADDED,
  SEARCH_TERM_REMOVED,
  SEARCH_CURSOR_MOVED,
  SEARCH_SORT_SELECTED,
  SEARCH_OPERATOR_SELECTED,
} from './actions.js';

import { sortKeys } from './constants';

import { RESET_FILTER } from '../filter/actions';

const initialState = {
  category: null,
  cursor: 0,
  operators: {},
  nextOperator: 'OR',
  recent: new Set(),
  sort: sortKeys.FREQ_DESC,
  text: '',
  terms: new Set(),
  visible: false,
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
        cursor: 0,
        operators: state.terms.size ? {
          ...state.operators,
          [payload.key]: state.nextOperator,
        } : state.operators,
        recent: new Set(state.recent),
        terms: new Set([ ...state.terms, payload ]),
        text: '',
      };
    }
    case SEARCH_TERM_REMOVED: {
      state.terms.delete(payload);
      delete state.operators[payload.key];
      return {
        ...state,
        cursor: 0,
        operators: { ...state.operators },
        recent: addToRecent(state, [ payload ]),
        terms: new Set(state.terms),
        text: '',
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
        recent: addToRecent(state, state.terms),
        terms: new Set(),
        termKeys: new Set(),
        operators: {},
      };
    case SEARCH_SORT_SELECTED:
      return {
        ...state,
        sort: payload,
      };
    case SEARCH_OPERATOR_SELECTED: {
      if (payload === state.nextOperator) return state;
      return {
        ...state,
        nextOperator: payload,
      };
    }
    default:
      return state;
  }
}
