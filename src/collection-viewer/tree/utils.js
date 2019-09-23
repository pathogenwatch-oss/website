import { utils } from 'phylocanvas';

import Organisms from '../../organisms';
import { leafStyles, topLevelTrees } from './constants';

export function collapseTreeBranches(node, leafPredicate) {
  if (node.leaf) {
    node.collapsed = false;
    return leafPredicate(node);
  }
  const childrenToCollapse = node.children.reduce((memo, child) => {
    const flag = collapseTreeBranches(child, leafPredicate);
    if (flag) memo.push(child);
    return memo;
  }, []);
  const someCollapsed = childrenToCollapse.length < node.children.length;
  if (someCollapsed) {
    for (const child of childrenToCollapse) {
      if (!child.leaf) child.collapsed = true;
    }
  }
  return !someCollapsed;
}

export function getLeafStyle(genome) {
  if (genome.reference) {
    return leafStyles.reference;
  }
  if (genome.public) {
    return leafStyles.public;
  }
  return leafStyles.collection;
}

const TREE_LABELS_SUFFIX = 'tree-labels.txt';

export function getFilenames(title, collectionId) {
  const formattedTitle = title.toLowerCase();
  const PREFIX = `pathogenwatch-${Organisms.nickname}-${collectionId}-${formattedTitle}`;
  return {
    image: `${PREFIX}-tree.png`,
    leafLabels: `${PREFIX}-${TREE_LABELS_SUFFIX}`,
    newick: `${PREFIX}.nwk`,
  };
}

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
