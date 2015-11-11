import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = {};

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (!ready || error) {
      return state;
    }

    if (result) {
      return {
        uploaded: result[0],
        reference: result[1],
      };
    }
  },
};

export default { actions, initialState };
