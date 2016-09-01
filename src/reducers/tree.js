import { FETCH_ENTITIES } from '../actions/fetch';

import { FETCH_TREE, SET_TREE } from '../actions/tree';
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
    [FETCH_TREE.SUCCESS](state, { result, name }) {
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
    [FETCH_TREE.FAILURE](state) {
      ToastActionCreators.showToast({
        message: 'Subtree currently unavailable, please try again later.',
      });
      return state;
    },
    [SET_TREE](state, { name }) {
      return name;
    },
  },
};

const contradication = () => false;

export const treeLoading = {
  initialState: false,
  actions: {
    [FETCH_TREE.ATTEMPT]: () => true,
    [FETCH_TREE.SUCCESS]: contradication,
    [FETCH_TREE.FAILURE]: contradication,
  },
};
