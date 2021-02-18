import { types } from '@cgps/phylocanvas';
import { utils } from '@cgps/phylocanvas';

export default function (tree, x, y) {
  const pad = utils.mapValue(tree, 3);
  const nodeSize = utils.mapValue(tree, tree.state.nodeSize);

  const layout = tree.layout();

  for (const node of layout.postorderTraversal) {
    if (
      !node.isHidden &&
      x > node.x - (nodeSize + pad) &&
      x < node.x + (nodeSize + pad) &&
      y > node.y - (nodeSize + pad) &&
      y < node.y + (nodeSize + pad)
    ) {
      return node;
    }
  }

  const typeDef = types[tree.state.type];
  if (typeDef.getNodeAtPoint) {
    return typeDef.getNodeAtPoint(tree, x, y, pad);
  }

  return null;
}
