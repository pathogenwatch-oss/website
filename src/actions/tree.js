import { getSubtree } from '../utils/Api';

import { speciesTrees } from '../constants/tree';

import Species from '../species';

export const SET_TREE = 'SET_TREE';

export function displayTree({ name, newick }, collectionId) {
  if (!speciesTrees.has(name) && !newick) {
    return {
      type: SET_TREE,
      name,
      promise: getSubtree(Species.id, collectionId, name),
    };
  }

  return {
    type: SET_TREE,
    name,
  };
}
