import { createAsyncConstants } from '../../actions';
import { showToast } from '../../toast';

import { getTrees } from './selectors';
import { getSubtree } from '../../utils/Api';
import Species from '../../species';

export const SET_TREE = 'SET_TREE';
export const FETCH_TREE = createAsyncConstants('FETCH_TREE');

const errorToast = {
  message: 'Subtree currently unavailable, please try again later.',
};

function setTree(name) {
  return {
    type: SET_TREE,
    payload: {
      name,
    },
  };
}

function fetchTree(name) {
  return (dispatch, getState) => {
    const { collection } = getState();
    return dispatch({
      type: FETCH_TREE,
      payload: {
        stateKey: name,
        promise: getSubtree(Species.id, collection.id, name),
      },
    });
  };
}

export function displayTree(name) {
  return (dispatch, getState) => {
    const state = getState();
    const tree = getTrees(state)[name];

    if (tree && tree.newick) {
      dispatch(setTree(name));
      return;
    }

    dispatch(fetchTree(name)).
      then(() => dispatch(setTree(name))).
      catch(() => dispatch(showToast(errorToast)));
  };
}
