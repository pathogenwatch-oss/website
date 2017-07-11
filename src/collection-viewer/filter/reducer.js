import {
  ACTIVATE_FILTER,
  APPEND_TO_FILTER,
  REMOVE_FROM_FILTER,
  RESET_FILTER,
} from './actions';
import { TREE_LOADED } from '../tree/actions';
import { SEARCH_TERM_ADDED } from '../search/actions';

import { filterKeys } from '../filter/constants';

const initialState = {
  active: false,
  unfilteredIds: [], // An array to allow indentical ids arrays not to cause an update
  [filterKeys.VISIBILITY]: new Set(),
  [filterKeys.HIGHLIGHT]: new Set(),
};

export default function (state = initialState, { type, payload = {} }) {
  const { ids } = payload;
  switch (type) {
    case TREE_LOADED: {
      const { leafIds } = payload;
      const reset = state.active && !leafIds.some(id => state.ids.has(id));

      return {
        ...state,
        unfilteredIds: leafIds,
        [filterKeys.VISIBILITY]: reset ? new Set() : state.ids,
        active: reset ? false : state.active,
      };
    }
    case ACTIVATE_FILTER: {
      return {
        ...state,
        [filterKeys.HIGHLIGHT]: initialState[filterKeys.HIGHLIGHT],
        active: payload.key === filterKeys.VISIBILITY ? true : state.active,
        [payload.key]: ids,
      };
    }
    case APPEND_TO_FILTER: {
      if (payload.key === filterKeys.HIGHLIGHT) {
        return {
          ...state,
          highlighted: new Set([ ...state.highlighted, ...ids ]),
        };
      }
      return {
        ...state,
        active: payload.key === filterKeys.VISIBILITY ? true : state.active,
        [payload.key]: new Set([ ...state[payload.key], ...ids ]),
      };
    }
    case REMOVE_FROM_FILTER: {
      const newIds = Array.from(state[payload.key]).filter(id => !ids.has(id));
      if (newIds.length) {
        return {
          ...state,
          active: payload.key === filterKeys.VISIBILITY ? true : state.active,
          [payload.key]: new Set(newIds),
        };
      }
      return {
        ...state,
        active: payload.key === filterKeys.VISIBILITY ? false : state.active,
        [payload.key]: initialState[payload.key],
      };
    }
    case RESET_FILTER:
    case SEARCH_TERM_ADDED:
      return {
        ...state,
        active: payload.key === filterKeys.VISIBILITY ? false : state.active,
        [payload.key]: initialState[payload.key],
      };
    default:
      return state;
  }
}
