import {
  ACTIVATE_FILTER,
  APPEND_TO_FILTER,
  REMOVE_FROM_FILTER,
  RESET_FILTER,
  CLEAR_FILTERS,
} from './actions';
import { TREE_LOADED } from '../tree/actions';
import { FETCH_COLLECTION } from '../actions';

import { filterKeys } from './constants';

const emptySet = new Set();

const initialState = {
  unfilteredIds: [],
  [filterKeys.VISIBILITY]: {
    unfilteredIds: [],
    ids: emptySet,
    active: false,
  },
  [filterKeys.TREE]: {
    ids: emptySet,
    active: false,
  },
  [filterKeys.MAP]: {
    ids: emptySet,
    active: false,
  },
};

export default function (state = initialState, { type, payload = {} }) {
  const { ids } = payload || {};
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { genomes = [] } = payload.result;
      const unfilteredIds = genomes.map(_ => _.uuid);
      return {
        ...state,
        [filterKeys.VISIBILITY]: {
          unfilteredIds,
          ids: emptySet,
          active: false,
        },

        unfilteredIds,
        [filterKeys.TREE]: {
          ids: emptySet,
          active: false,
        },
        [filterKeys.MAP]: {
          ids: emptySet,
          active: false,
        },
      };
    }
    case TREE_LOADED: {
      const { leafIds } = payload;

      const isActive =
        state[filterKeys.VISIBILITY].isActive ||
        state[filterKeys.TREE].isActive ||
        state[filterKeys.MAP].isActive;

      const existingIds = new Set([
        ...state[filterKeys.VISIBILITY].ids,
        ...state[filterKeys.TREE].ids,
        ...state[filterKeys.MAP].ids,
      ]);

      const shouldClearFilter = isActive && !leafIds.some(id => existingIds.has(id));
      return {
        ...state,
        [filterKeys.VISIBILITY]: {
          unfilteredIds: leafIds,
          ids: shouldClearFilter ? emptySet : state[filterKeys.VISIBILITY].ids,
          active: shouldClearFilter ? false : state[filterKeys.VISIBILITY].active,
        },

        unfilteredIds: leafIds,
        [filterKeys.TREE]: {
          ids: shouldClearFilter ? emptySet : state[filterKeys.TREE].ids,
          active: shouldClearFilter ? false : state[filterKeys.TREE].active,
        },
        [filterKeys.MAP]: {
          ids: shouldClearFilter ? emptySet : state[filterKeys.MAP].ids,
          active: shouldClearFilter ? false : state[filterKeys.MAP].active,
        },
      };
    }
    case ACTIVATE_FILTER: {
      return {
        ...state,
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
      return {
        ...state,
        [payload.key]: {
          ...state[payload.key],
          ids: emptySet,
          active: false,
        },
      };
    case CLEAR_FILTERS:
      return {
        ...state,
        [filterKeys.VISIBILITY]: {
          ...state[filterKeys.VISIBILITY],
          ids: emptySet,
          active: false,
        },

        [filterKeys.TREE]: {
          ids: emptySet,
          active: false,
        },
        [filterKeys.MAP]: {
          ids: emptySet,
          active: false,
        },
      };
    default:
      return state;
  }
}
