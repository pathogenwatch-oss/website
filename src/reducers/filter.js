import {
  SET_UNFILTERED_IDS,
  ACTIVATE_FILTER,
  RESET_FILTER,
} from '../actions/filter';


const initialState = {
  active: false,
  unfilteredIds: [],
  ids: [],
};

const actions = {
  [SET_UNFILTERED_IDS]: function (state, { ids }) {
    return {
      ...state,
      unfilteredIds: ids,
    };
  },
  [ACTIVATE_FILTER]: function (state, { ids }) {
    return {
      ...state,
      active: true,
      ids,
    };
  },
  [RESET_FILTER]: function (state) {
    return {
      ...state,
      active: false,
      ids: [],
    };
  },
};

export default { initialState, actions };
