import {
  SET_UNFILTERED_IDS,
  ACTIVATE_FILTER,
  APPEND_TO_FILTER,
  REMOVE_FROM_FILTER,
  RESET_FILTER,
} from './actions';


const initialState = {
  active: false,
  unfilteredIds: new Set(),
  ids: new Set(),
};

const actions = {
  [SET_UNFILTERED_IDS](state, { ids }) {
    const noReset =
      state.active && Array.from(ids).some(id => state.ids.has(id));
    return {
      ...state,
      unfilteredIds: ids,
      ids: noReset ? state.ids : new Set(),
      active: noReset,
    };
  },
  [ACTIVATE_FILTER](state, { ids }) {
    return {
      ...state,
      active: true,
      ids,
    };
  },
  [APPEND_TO_FILTER](state, { ids }) {
    return {
      ...state,
      active: true,
      ids: new Set([ ...state.ids, ...ids ]),
    };
  },
  [REMOVE_FROM_FILTER](state, { ids }) {
    return {
      ...state,
      active: true,
      ids: new Set(Array.from(state.ids).filter(id => !ids.has(id))),
    };
  },
  [RESET_FILTER](state) {
    return {
      ...state,
      active: false,
      ids: new Set(),
    };
  },
};

export default { initialState, actions };
