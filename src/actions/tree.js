export const SWITCH_TREE = 'SWITCH_TREE';

export function switchTree(tree) {
  return {
    type: SWITCH_TREE,
    tree,
  };
}
