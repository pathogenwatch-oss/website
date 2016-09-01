import { FETCH_ENTITIES } from '../actions/fetch';

import { SET_TREE } from '../actions/tree';
import ToastActionCreators from '../actions/ToastActionCreators';

import { COLLECTION, POPULATION } from '../constants/tree';

export const trees = {
  initialState: {},
  actions: {
    [FETCH_ENTITIES.SUCCESS](state, payload) {
      const [ uploaded, reference ] = payload;
      return {
        [COLLECTION]: { name: COLLECTION, newick: uploaded.tree },
        [POPULATION]: { name: POPULATION, newick: reference.tree },
        ...uploaded.subtrees,
      };
    },
    [SET_TREE.SUCCESS](state, { result, name }) {
      if (!result) {
        return state;
      }

      return {
        ...state,
        [name]: {
          name,
          newick: result.tree,
        },
      };
    },
  },
};

export const displayedTree = {
  initialState: COLLECTION,
  actions: {
    [SET_TREE.FAILURE](state) {
      ToastActionCreators.showToast({
        message: 'Subtree currently unavailable, please try again later.',
      });
      return state;
    },
    [SET_TREE.SUCCESS](state, { name }) {
      return name || state;
    },
  },
};

const contradication = () => false;

export const treeLoading = {
  initialState: false,
  actions: {
    [SET_TREE.ATTEMPT]: () => true,
    [SET_TREE.SUCCESS]: contradication,
    [SET_TREE.FAILURE]: contradication,
  },
};
