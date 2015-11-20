import assign from 'object-assign';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLLECTION_ID } from '../actions/collection';

import { POPULATION, COLLECTION } from '../constants/tree';

export const assemblies = {
  initialState: {},
  actions: {
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (!ready || error) {
        return state;
      }

      if (result) {
        const [ uploaded, reference ] = result;
        return assign({}, uploaded.assemblies, reference.assemblies);
      }
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
          [COLLECTION]: { newick: uploaded.tree },
          [POPULATION]: { newick: reference.tree },
          ...uploaded.subtrees,
        };
      }
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
          subtreeIds: Object.keys(uploaded.subtrees),
        };
      }
    },
  },
};
