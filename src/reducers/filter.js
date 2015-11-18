import { ACTIVATE_FILTER, RESET_FILTER } from '../actions/filter';

const initialState = { active: false };

const actions = {
  [ACTIVATE_FILTER]: function (state, { ids }) {
    return {
      active: true,
      ids,
    };
  },
  [RESET_FILTER]: function () {
    return initialState;
  },
};

export default { initialState, actions };
