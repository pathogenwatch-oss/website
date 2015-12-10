import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLLECTION_ID } from '../actions/collection';
import { SET_TREE } from '../actions/tree';

import { POPULATION, COLLECTION } from '../constants/tree';

function replaceSubtypeDisplayNames(uploaded, reference) {
  return Object.keys(uploaded)
    .reduce(function (memo, assemblyId) {
      const { populationSubtype, ...assembly } = uploaded[assemblyId];
      memo[assemblyId] = {
        ...assembly,
        populationSubtype:
          reference[populationSubtype].metadata.assemblyName,
      };
      return memo;
    }, {}
  );
}

export const assemblies = {
  initialState: {},
  actions: {
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (!ready || error) {
        return state;
      }

      if (result) {
        const [ uploaded, reference ] = result;
        return {
          ...replaceSubtypeDisplayNames(uploaded.assemblies, reference.assemblies),
          ...reference.assemblies,
        };
      }
    },
    [SET_TREE]: function (state, { ready, result }) {
      if (ready && result) {
        return {
          ...state,
          ...result.assemblies,
        };
      }
      return state;
    },
  },

};

export const trees = {
  initialState: {},
  actions: {
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (!ready || error) {
        return state;
      }

      if (result) {
        const [ uploaded, reference ] = result;
        return {
          [COLLECTION]: { name: COLLECTION, newick: uploaded.tree },
          [POPULATION]: { name: POPULATION, newick: reference.tree },
          ...uploaded.subtrees,
        };
      }
    },
    [SET_TREE]: function (state, { ready, result, name }) {
      if (ready && result) {
        return {
          ...state,
          [name]: {
            name,
            newick: result.newick,
          },
        };
      }

      return state;
    },
  },
};

export const collection = {
  initialState: { id: null, assemblyIds: [] },
  actions: {
    [SET_COLLECTION_ID]: function (state, { id }) {
      return {
        ...state,
        id,
      };
    },
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (!ready || error) {
        return state;
      }

      if (result) {
        const [ uploaded ] = result;
        return {
          ...state,
          assemblyIds: Object.keys(uploaded.assemblies),
          subtrees: uploaded.subtrees,
        };
      }
    },
  },
};
