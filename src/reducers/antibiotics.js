import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = [];

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result }) {
    if (ready && result) {
      return result[2];
    }
    return state;
  },
};

export default { actions, initialState };
