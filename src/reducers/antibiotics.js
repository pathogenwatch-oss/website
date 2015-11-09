import { SET_ANTIBIOTICS } from '../actions/antibiotics';

const initialState = [];

const actions = {
  [SET_ANTIBIOTICS]: function (state, { ready, result }) {
    if (ready) {
      return Object.keys(result);
    }
    return state;
  },
};

export default { actions, initialState };
