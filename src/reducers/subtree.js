import { SET_SUBTREE } from '../actions/tree';

const initialState = null;

const actions = {
  [SET_SUBTREE]: function (state, { subtree }) {
    return typeof subtree !== 'undefined' ? subtree : state;
  },
};

export default { initialState, actions };
