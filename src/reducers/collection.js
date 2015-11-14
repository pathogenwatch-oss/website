import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = {};

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (!ready || error) {
      return state;
    }

    if (result) {
      const { collectionId, assemblies, tree } = result[0];
      return {
        uploaded: {
          collectionId,
          assemblies,
          tree,
          assemblyIds: Object.keys(assemblies),
        },
        reference: result[1],
      };
    }
  },
};

export default { actions, initialState };
