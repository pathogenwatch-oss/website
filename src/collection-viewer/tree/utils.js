import { getColumnLabel } from '../../table/utils';
import Species from '../../species';
import { POPULATION } from '../../app/stateKeys/tree';
import { leafStyles, titles } from './constants';

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

export function getLeafStyle(assembly) {
  if (assembly.__isReference) {
    return leafStyles.reference;
  }
  if (assembly.__isPublic) {
    return leafStyles.public;
  }
  return leafStyles.collection;
}

const TREE_LABELS_SUFFIX = 'tree_labels.txt';

export function getFilenames(title, collectionId, column) {
  const formattedTitle = title.toLowerCase();
  const formattedColumnLabel = getColumnLabel(column).toLowerCase();
  const PREFIX = `wgsa_${Species.nickname}_${collectionId}_${formattedTitle}`;
  return {
    image: `${PREFIX}_tree.png`,
    leafLabels:
      title === titles[POPULATION] ?
        `${PREFIX}_${TREE_LABELS_SUFFIX}` :
        `${PREFIX}_${formattedColumnLabel}_${TREE_LABELS_SUFFIX}`,
    newick: `${PREFIX}.nwk`,
  };
}
