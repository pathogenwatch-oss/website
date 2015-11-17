
import { SET_TABLE } from '../actions/table';

import { metadata } from '../constants/table';

const initialState = metadata;

const actions = {
  [SET_TABLE]: function (state, action) {
    return action.table || state;
  },
};

export default { initialState, actions };
