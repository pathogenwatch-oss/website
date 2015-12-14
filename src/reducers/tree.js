import { FETCH_ENTITIES } from '../actions/fetch';

import { SET_TREE } from '../actions/tree';

import { COLLECTION, POPULATION } from '../constants/tree';

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
            newick: result.tree,
          },
        };
      }
      return state;
    },
  },
};

export const displayedTree = {
  initialState: POPULATION,
  actions: {
    [SET_TREE]: function (state, { name, ready = true }) {
      if (ready) {
        return name;
      }

      return state;
    },
  },
};

export const treeLoading = {
  initialState: false,
  actions: {
    [SET_TREE]: function (state, { ready = true }) {
      return !ready;
    },
  },
};
