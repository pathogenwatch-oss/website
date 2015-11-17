
export const SWITCH_TREE = 'SWITCH_TREE';

export function switchTree(tree) {
  return {
    type: SWITCH_TREE,
    tree,
  };
}

export const SET_SUBTREE = 'SET_SUBTREE';

export function setSubtree(subtree) {
  return {
    type: SET_SUBTREE,
    subtree,
  };
}
