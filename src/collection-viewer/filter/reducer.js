import {
  ACTIVATE_FILTER,
  APPEND_TO_FILTER,
  REMOVE_FROM_FILTER,
  RESET_FILTER,
} from './actions';
import { TREE_LOADED } from '../tree/actions';
import { SEARCH_TERM_ADDED } from '../search/actions';
import { FETCH_COLLECTION } from '../actions';

import { filterKeys } from '../filter/constants';

const emptySet = new Set();

const initialState = {
  [filterKeys.VISIBILITY]: {
    unfilteredIds: [],
    ids: emptySet,
    active: false,
  },
  [filterKeys.HIGHLIGHT]: {
    ids: emptySet,
    active: false,
  },
};

export default function (state = initialState, { type, payload = {} }) {
  const { ids } = payload;
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { genomes = [] } = payload.result;
      return {
        ...state,
        [filterKeys.VISIBILITY]: {
          unfilteredIds: genomes.map(_ => _.uuid),
          ids: new Set(),
          active: false,
        },
      };
    }
    case TREE_LOADED: {
      const { leafIds } = payload;
      const filter = state[filterKeys.VISIBILITY];
      const reset = filter.active && !leafIds.some(id => filter.ids.has(id));
      return {
        ...state,
        [filterKeys.VISIBILITY]: {
          unfilteredIds: leafIds,
          ids: reset ? new Set() : filter.ids,
          active: reset ? false : filter.active,
        },
      };
    }
    case ACTIVATE_FILTER: {
      return {
        ...state,
        [filterKeys.HIGHLIGHT]:
          payload.key === filterKeys.VISIBILITY ?
            initialState[filterKeys.HIGHLIGHT] : // reset highlight when visibility changes
            state[filterKeys.HIGHLIGHT],
        [payload.key]: {
          ...state[payload.key],
          ids,
          active: true,
        },
      };
    }
    case APPEND_TO_FILTER: {
      const filter = state[payload.key];
      return {
        ...state,
        [payload.key]: {
          ...filter,
          ids: new Set([ ...filter.ids, ...ids ]),
          active: true,
        },
      };
    }
    case REMOVE_FROM_FILTER: {
      const filter = state[payload.key];
      const newIds = Array.from(filter.ids).filter(id => !ids.has(id));
      if (newIds.length) {
        return {
          ...state,
          [payload.key]: {
            ...filter,
            ids: new Set(newIds),
            active: true,
          },
        };
      }
      return {
        ...state,
        [payload.key]: {
          ...filter,
          ids: emptySet,
          active: false,
        },
      };
    }
    case RESET_FILTER:
    case SEARCH_TERM_ADDED:
      return {
        ...state,
        [payload.key]: {
          ...state[payload.key],
          ids: emptySet,
          active: false,
        },
      };
    default:
      return state;
  }
}
