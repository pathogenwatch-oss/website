import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = [];

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, { payload }) {
    return payload[2];
  },
};

export default { actions, initialState };
