import { methods } from '@cgps/phylocanvas';
import { utils } from '@cgps/phylocanvas';

export default function (tree, layout) {
  methods.preRender(tree, layout);
  tree._.actualHaloRadius = utils.mapValue(tree, tree.state.haloRadius);
  tree._.renderShapes = (tree.state.nodeSize >= 1);
}
