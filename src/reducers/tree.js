import { SET_TREE } from '../actions/tree';

import { POPULATION } from '../constants/tree';

export default {
  display: {
    initialState: POPULATION,
    actions: {
      [SET_TREE]: function (state, { name, ready = true }) {
        if (ready) {
          return name;
        }

        return state;
      },
    },
  },
  loading: {
    initialState: false,
    actions: {
      [SET_TREE]: function (state, { ready = true }) {
        return !ready;
      },
    },
  },
};
