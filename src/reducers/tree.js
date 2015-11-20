import { SET_TREE } from '../actions/tree';

import { POPULATION } from '../constants/tree';

const initialState = POPULATION;

const actions = {
  [SET_TREE]: function (state, { tree }) {
    return tree || state;
  },
};

export default { initialState, actions };
