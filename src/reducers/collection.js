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
          [COLLECTION]: uploaded.tree,
          [POPULATION]: reference.tree,
        };
      }
    },
  },
};

export const collectionId = {
  initialState: '',
  actions: {
    [SET_COLLECTION_ID]: function (state, { id }) {
      return id || state;
    },
  },
};
