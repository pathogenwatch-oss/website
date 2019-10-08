import { utils } from 'phylocanvas';

import { topLevelTrees } from './constants';

const canvas = document.createElement('canvas');
export function takeSnapshot(phylocanvas) {
  const [ [ left, top ], [ right, bottom ] ] = phylocanvas.getBounds();
  const topLeft = utils.canvas.undoPointTranslation({ x: left, y: top }, phylocanvas);
  const bottomRight = utils.canvas.undoPointTranslation({ x: right, y: bottom }, phylocanvas);
  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;
  const { padding } = phylocanvas;
  canvas.width = width + padding * 2;
  canvas.height = height + padding * 2;

  const imageData = phylocanvas.canvas.getImageData(
    topLeft.x,
    topLeft.y,
    width,
    height
  );
  canvas.getContext('2d').putImageData(imageData, padding, padding);
  return canvas.toDataURL();
}

export function getLinearStep({ step, treeType }) {
  if (treeType === 'circular' || treeType === 'radial') {
    return step * 2 * Math.PI;
  }
  return step;
}

export function isSubtree(treeName) {
  return !(topLevelTrees.has(treeName));
}
