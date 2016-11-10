import { createAsyncConstants } from '../../actions';
import { showToast } from '../../toast';

import { speciesTrees } from './constants';
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

export function displayTree({ name, newick }) {
  return (dispatch, getState) => {
    if (speciesTrees.has(name) || newick) {
      dispatch(setTree(name));
      return;
    }

    const { collection } = getState();

    dispatch({
      type: FETCH_TREE,
      payload: {
        stateKey: name,
        promise: getSubtree(Species.id, collection.id, name),
      },
    }).then(() => dispatch(setTree(name)))
      .catch(() => dispatch(showToast(errorToast)));
  };
}
