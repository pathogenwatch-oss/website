import { getSubtree } from '../utils/Api';

import { speciesTrees } from '../constants/tree';
import { createAsyncConstants } from '../actions';

import Species from '../species';

export const SET_TREE = createAsyncConstants('SET_TREE');

export function displayTree({ name, newick }, collectionId) {
  if (!speciesTrees.has(name) && !newick) {
    return {
      type: SET_TREE,
      payload: {
        name,
        promise: getSubtree(Species.id, collectionId, name),
      },
    };
  }

  return {
    type: SET_TREE.SUCCESS,
    payload: {
      name,
    },
  };
}
