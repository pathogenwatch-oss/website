import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = [];

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, result) {
    return result[2];
  },
};

export default { actions, initialState };
