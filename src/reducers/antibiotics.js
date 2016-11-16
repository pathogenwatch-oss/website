import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = [];

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, { result }) {
    const { antibiotics } = result[2];
    return antibiotics.map(ab => (typeof ab === 'string' ? { name: ab } : ab));
  },
};

export default { actions, initialState };
