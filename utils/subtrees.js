/* eslint no-param-reassign: ["error", { "props": false }] */

function getPrunedLeafString([ leafString, firstChar, lastChar ]) {
  switch (firstChar + lastChar) {
    case ',,':
      return ',';
    case '(,':
      return '(';
    case ',)':
      return ')';
    case '()':
      return '';
    default:
      throw new Error(`Invalid leaf string: '${leafString}'`);
  }
}

function pruneLeaf(name, newick, leafId) {
  const regex = new RegExp(`([(,])${leafId}:[^,)]+([,)])`, 'g');
  const match = regex.exec(newick);
  if (!match || match.length === 0) {
    throw new Error(`Cannot find leaf '${leafId}' in tree '${name}'`);
  }
  const prunedLeafString = getPrunedLeafString(match);
  return newick.replace(regex, prunedLeafString);
}

function pruneTree(name, newick, leafIds) {
  let prunedTree = newick;
  for (const leafId of leafIds) {
    prunedTree = pruneLeaf(name, prunedTree, leafId);
  }
  return prunedTree;
}

function cleanLeaf(name, newick, leafId) {
  const regex = new RegExp(`[(]${leafId}:([^,)]+)[)]:([^,)]+)([,)])`, 'g');
  const match = regex.exec(newick);
  if (!match || match.length === 0 || !match[0]) {
    return newick;
  }
  const dist = parseFloat(match[1]) + parseFloat(match[2]);
  return newick.replace(regex, `${leafId}:${dist}${match[3]}`);
}

function cleanTree(name, newick, leafIds) {
  let prunedTree = newick;
  for (const leafId of leafIds) {
    prunedTree = cleanLeaf(name, prunedTree, leafId);
  }

  prunedTree = prunedTree.replace(/[(][(][(]:0[)]:0[)]:0[)]:0,/g, '');
  prunedTree = prunedTree.replace(/,[(][(][(]:0[)]:0[)]:0[)]:0/g, '');
  prunedTree = prunedTree.replace(/[(]:0[)]:0,/g, '');
  prunedTree = prunedTree.replace(/,[(]:0[)]:0/g, '');
  prunedTree = prunedTree.replace(/[(]:0,/g, '(');
  prunedTree = prunedTree.replace(/,:0[)]/g, ')');
  return prunedTree;
}

module.exports.prune = function (newick, leafIds, treeName = '') {
  let tree = newick;
  tree = pruneTree(treeName, tree, leafIds);
  return tree;
};

module.exports.clean = function (newick, leafIds, treeName = '') {
  let tree = newick;
  tree = cleanTree(treeName, tree, leafIds);
  return tree;
};
