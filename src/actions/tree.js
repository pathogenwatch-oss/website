
export const SET_TREE = 'SET_TREE';

export function displayTree(tree) {
  return {
    type: SET_TREE,
    tree,
  };
}
