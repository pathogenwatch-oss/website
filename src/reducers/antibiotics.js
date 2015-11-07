import { SET_ANTIBIOTICS } from '../actions/antibiotics';

const actions = {
  [SET_ANTIBIOTICS]: function (state, { ready, result }) {
    if (ready) {
      return Object.keys(result);
    }
    return state;
  },
};

export default function (state = [], action) {
  if (actions[action.type]) {
    return actions[action.type](state, action);
  }
  return state;
}
