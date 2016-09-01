import { getSubtree } from '../utils/Api';

import { speciesTrees } from '../constants/tree';
import { createAsyncConstants } from '../actions';

import Species from '../species';

export const SET_TREE = 'SET_TREE';
export const FETCH_TREE = createAsyncConstants('FETCH_TREE');

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
    }).then(() => dispatch(setTree));
  };
}
