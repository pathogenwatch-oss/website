import {
  SEARCH_TOGGLE_MODE,
  SEARCH_TOGGLE_EXACT_MATCH,
  SEARCH_TEXT_CHANGED,
  SEARCH_CATEGORY_SELECTED,
  SEARCH_TERM_ADDED,
  SEARCH_TERM_REMOVED,
  SEARCH_CURSOR_MOVED,
  SEARCH_INTERSECTION_MOVED,
  SEARCH_SORT_SELECTED,
  SEARCH_OPERATOR_SELECTED,
} from './actions.js';

import { doesNotIntersect } from './utils';
import { sortKeys } from './constants';

import { RESET_FILTER, ACTIVATE_FILTER } from '../filter/actions';
import { filterKeys } from '../filter/constants';

const initialState = {
  advanced: false,
  exact: false,
  category: null,
  cursor: 0,
  currentIntersection: 0,
  intersections: [],
  recent: new Set(),
  sort: sortKeys.FREQ_DESC,
  text: '',
};

function addToRecent(state, terms) {
  const next = new Set();
  for (const term of [ ...terms, ...state.recent ]) {
    next.add(term);
    if (next.size === 3) break;
  }
  return next;
}

function applyBasicSearchTerm(state, term) {
  if (!term || state.advanced) return state;
  const text = term.value.label;
  if (text.length) {
    return {
      ...state,
      text,
      intersections: [ [ term ] ],
    };
  }
  return {
    ...state,
    text: initialState.text,
    intersections: initialState.intersections,
  };
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SEARCH_TOGGLE_MODE:
      return {
        ...state,
        advanced: !state.advanced,
        text: '',
      };
    case SEARCH_TOGGLE_EXACT_MATCH: {
      return {
        ...applyBasicSearchTerm(state, payload),
        exact: !state.exact,
      };
    }
    case SEARCH_TEXT_CHANGED:
      return {
        ...state,
        text: payload,
        cursor: 0,
      };
    case SEARCH_CATEGORY_SELECTED: {
      const { intersections, currentIntersection } = state;
      const { category } = payload;
      const terms = intersections[currentIntersection] || [];
      let nextIntersection = currentIntersection;
      if (category && doesNotIntersect(category, terms)) {
        nextIntersection = intersections.length;
      }
      return {
        ...state,
        category: payload.category,
        currentIntersection: nextIntersection,
        text: '',
        cursor: 0,
      };
    }
    case SEARCH_TERM_ADDED: {
      if (!state.advanced) {
        return applyBasicSearchTerm(state, payload);
      }
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
    case SEARCH_INTERSECTION_MOVED: {
      const { intersections, currentIntersection } = state;
      const nextIntersection = currentIntersection + payload.delta;
      if (nextIntersection < 0 || nextIntersection > intersections.length) {
        return state;
      }
      return {
        ...state,
        currentIntersection: nextIntersection,
      };
    }
    case SEARCH_CURSOR_MOVED:
      return {
        ...state,
        cursor: Math.max(0, state.cursor + payload.delta),
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
    case ACTIVATE_FILTER:
    case RESET_FILTER: {
      if (payload.key !== filterKeys.VISIBILITY) return state;
      return {
        ...initialState,
        recent: state.recent,
        exact: state.exact,
        advanced: state.advanced,
      };
    }
    default:
      return state;
  }
}
