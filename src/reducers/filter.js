import {
  SET_UNFILTERED_IDS,
  ACTIVATE_FILTER,
  APPEND_TO_FILTER,
  RESET_FILTER,
} from '../actions/filter';


const initialState = {
  active: false,
  unfilteredIds: new Set(),
  ids: new Set(),
};

const actions = {
  [SET_UNFILTERED_IDS]: function (state, { ids }) {
    const noReset = state.active && Array.from(ids).some(id => state.ids.has(id));
    return {
      ...state,
      unfilteredIds: ids,
      ids: noReset ? state.ids : new Set(),
      active: noReset,
    };
  },
  [ACTIVATE_FILTER]: function (state, { ids }) {
    return {
      ...state,
      active: true,
      ids,
    };
  },
  [APPEND_TO_FILTER]: function (state, { ids }) {
    const newIds = new Set([ ...state.ids, ...ids ]);
    return {
      ...state,
      active: true,
      ids: newIds,
    };
  },
  [RESET_FILTER]: function (state) {
    return {
      ...state,
      active: false,
      ids: new Set(),
    };
  },
};

export default { initialState, actions };
