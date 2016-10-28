import { createAsyncConstants } from '../actions';
import { showToast } from '../toast';

import { speciesTrees } from '../constants/tree';
import { getSubtree } from '../utils/Api';
import Species from '../species';

export const SET_TREE = 'SET_TREE';
export const FETCH_TREE = createAsyncConstants('FETCH_TREE');

const errorToast = {
  message: 'Subtree currently unavailable, please try again later.',
};

export function displayTree({ name, newick }, collectionId) {
  const setTree = { type: SET_TREE, name };

  return dispatch => {
    if (speciesTrees.has(name) || newick) {
      dispatch(setTree);
      return;
    }

    dispatch({
      type: FETCH_TREE,
      payload: {
        name,
        promise: getSubtree(Species.id, collectionId, name),
      },
    }).then(() => dispatch(setTree))
      .catch(() => dispatch(showToast(errorToast)));
  };
}
