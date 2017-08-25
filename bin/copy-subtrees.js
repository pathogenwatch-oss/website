/* eslint no-param-reassign: ["error", { "props": false }] */

const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');

const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

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
  const regex = new RegExp(`[(]${leafId}:([^)]+)[)]:([^,)]+)([,)])`, 'g');
  const match = regex.exec(newick);
  if (!match || match.length === 0 || !match[0]) {
    return newick;
    // throw new Error(`Cannot find leaf '${leafId}' in tree '${name}'`);
  }
  const dist = parseFloat(match[1]) + parseFloat(match[2]);
  return newick.replace(regex, `${leafId}:${dist}${match[3]}`);
}

function cleanTree(name, newick, leafIds) {
  let prunedTree = newick;
  for (const leafId of leafIds) {
    prunedTree = cleanLeaf(name, prunedTree, leafId);
  }
  return prunedTree;
}

function parseQuery() {
  const { src, dest } = argv.opts;
  if (!src || !dest) {
    throw new Error('Missing args');
  }
  return ([ src, dest ]);
}

function fetchCollections([ srcId, destId ]) {
  return Promise.all([
    Collection.findByUuid(srcId),
    Collection.findByUuid(destId),
  ]);
}

function fetchCollectionGenomes([ src, dest ]) {
  return Promise.all([
    CollectionGenome.find({ _collection: src._id }, { uuid: 1 }),
    CollectionGenome.find({ _collection: dest._id }, { uuid: 1 }),
  ])
  .then(([ srcGenomes, destGenomes ]) => [ src, dest, srcGenomes.map(_ => _.uuid), destGenomes.map(_ => _.uuid) ]);
}

function validateCollections([ src, dest, srcGenomes, destGenomes ]) {
  if (src.pmid !== dest.pmid) {
    throw new Error('PMID IDs do not match.');
  }
  if (src.size !== dest.size) {
    throw new Error('Collection sizes do not match.');
  }
  if (srcGenomes.length !== destGenomes.length) {
    throw new Error('Collection genomes do not match.');
  }
  return [ src, dest, srcGenomes, destGenomes ]; 
}

function copyMetadata([ src, dest, srcGenomes, destGenomes ]) {
  dest.title = src.title;
  dest.description = src.description;
  dest.pmid = src.pmid;
  dest.binned = false;
  dest.published = true;
  src.binned = true;

  return [ src, dest, srcGenomes, destGenomes ];
}

function copySubtrees([ src, dest, srcGenomes, destGenomes ]) {
  const originalSubtrees = dest.subtrees;
  dest.subtrees = src.subtrees;
  const srcIds = new Set(srcGenomes);
  const destIds = new Set(destGenomes);

  for (const subtree of dest.subtrees) {
    if (subtree.name === '90370_11909_3') {
      console.log('90370_11909_3');
    }
    const originalSubtree = originalSubtrees.filter(t => t.name === subtree.name);
    if (!originalSubtree) {
      throw new Error(`Cannot find subtree for ${subtree.name}`);
    }
    subtree.tree = pruneTree(subtree.name, subtree.tree, subtree.leafIds.filter(id => srcIds.has(id)));
    subtree.tree = cleanTree(subtree.name, subtree.tree, subtree.leafIds.filter(id => destIds.has(id)));
    subtree.leafIds = subtree.leafIds.filter(id => !srcIds.has(id));
    subtree.totalPublic -= subtree.totalCollection;
  }

  return [ src, dest, srcGenomes, destGenomes ];
}

function saveCollections([ , dest ]) {
  return dest.save();
}

mongoConnection.connect()
  .then(parseQuery)
  .then(fetchCollections)
  .then(fetchCollectionGenomes)
  .then(validateCollections)
  .then(copyMetadata)
  .then(copySubtrees)
  .then(saveCollections)
  .then(() => console.log('Done'))
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
