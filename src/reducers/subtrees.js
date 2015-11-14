import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = {};

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (!ready || error) {
      return state;
    }

    if (result) {
      return result[0].subtrees;
    }
  },
};

export default { actions, initialState };
