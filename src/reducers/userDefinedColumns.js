import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = [];

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (!ready || error) {
      return state;
    }

    if (result) {
      const { assemblies } = result[0];
      const ids = Object.keys(assemblies);
      const { userDefined } = assemblies[ids[0]].metadata;

      return userDefined ? Object.keys(userDefined) : [];
    }
  },
};

export default { actions, initialState };
