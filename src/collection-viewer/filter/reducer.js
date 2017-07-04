import {
  ACTIVATE_FILTER,
  APPEND_TO_FILTER,
  REMOVE_FROM_FILTER,
  RESET_FILTER,
} from './actions';
import { TREE_LOADED } from '../tree/actions';
import { SEARCH_TERM_ADDED, SEARCH_TERM_REMOVED } from '../search/actions';

const initialState = {
  active: false,
  unfilteredIds: [], // An array to allow indentical ids arrays not to cause an update
  ids: new Set(),
};

function append(state, ids) {
  return {
    ...state,
    active: true,
    ids: new Set([ ...state.ids, ...ids ]),
  };
}

function remove(state, ids) {
  const newIds = Array.from(state.ids).filter(id => !ids.has(id));
  if (newIds.length) {
    return {
      ...state,
      active: true,
      ids: new Set(newIds),
    };
  }
  return {
    ...state,
    active: false,
    ids: initialState.ids,
  };
}

export default function (state = initialState, { type, payload = {} }) {
  const { ids } = payload;
  switch (type) {
    case TREE_LOADED: {
      const { leafIds } = payload;
      const reset = state.active && !leafIds.some(id => state.ids.has(id));

      return {
        ...state,
        unfilteredIds: leafIds,
        ids: reset ? new Set() : state.ids,
        active: reset ? false : state.active,
      };
    }
    case ACTIVATE_FILTER:
      return {
        ...state,
        active: true,
        ids,
      };
    case APPEND_TO_FILTER:
      return append(state, ids);
    case REMOVE_FROM_FILTER: {
      return remove(state, ids);
    }
    case RESET_FILTER:
      return {
        ...state,
        active: false,
        ids: initialState.ids,
      };
    case SEARCH_TERM_ADDED: {
      return append(state, payload.value.ids);
    }
    case SEARCH_TERM_REMOVED: {
      return remove(state, new Set(payload.value.ids));
    }
    default:
      return state;
  }
}
