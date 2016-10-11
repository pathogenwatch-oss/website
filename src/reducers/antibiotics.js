import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = [];

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, { result }) {
    return result[2].map(ab => (typeof ab === 'string' ? { name: ab } : ab));
  },
};

export default { actions, initialState };
