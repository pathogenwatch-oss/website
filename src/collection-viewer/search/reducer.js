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
  currentIntersection: 0,
  intersections: [],
  recent: new Set(),
  sort: sortKeys.FREQ_DESC,
  text: '',
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
      const { currentIntersection } = state;
      const intersections = Array.from(state.intersections);
      const terms = (intersections[currentIntersection] || []);
      if (terms.some(term => term.key === payload.key)) return state;
      intersections[currentIntersection] = terms.concat(payload);
      return {
        ...state,
        category: null,
        cursor: 0,
        intersections,
        recent: addToRecent(state, [ payload ]),
        text: '',
      };
    }
    case SEARCH_TERM_REMOVED: {
      const { term, intersection } = payload;
      const intersections = Array.from(state.intersections);
      const terms = Array.from(intersections[intersection]);
      if (terms.length === 1) {
        intersections.splice(intersection, 1);
      } else {
        terms.splice(terms.indexOf(term), 1);
        intersections[intersection] = terms;
      }
      const currentIntersection =
        state.currentIntersection in intersections ?
          state.currentIntersection : Math.max(0, intersections.length - 1);
      return {
        ...state,
        cursor: 0,
        currentIntersection,
        intersections,
        recent: addToRecent(state, [ term ]),
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
        ...initialState,
        recent: state.recent,
      };
    case SEARCH_SORT_SELECTED:
      return {
        ...state,
        sort: payload,
      };
    case SEARCH_OPERATOR_SELECTED: {
      if (payload === state.currentIntersection) return state;
      return {
        ...state,
        currentIntersection: payload,
      };
    }
    default:
      return state;
  }
}
