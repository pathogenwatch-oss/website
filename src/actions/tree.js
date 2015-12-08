import { getSubtree } from '../utils/Api';

import { speciesTrees } from '../constants/tree';

import Species from '../species';

export const SET_TREE = 'SET_TREE';

export function displayTree({ name, newick }) {
  if (!speciesTrees.has(name) && !newick) {
    return {
      type: SET_TREE,
      name,
      promise: getSubtree(Species.id, name),
    };
  }

  return {
    type: SET_TREE,
    name,
  };
}
