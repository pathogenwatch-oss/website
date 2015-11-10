import { SET_COLLECTION } from '../actions/collection';

const initialState = {};

const actions = {
  [SET_COLLECTION]: function (state, action) { // { ready, result, error }
    console.log(action);
    return state;
  },
};

export default { actions, initialState };
