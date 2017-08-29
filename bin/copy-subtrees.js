/* eslint no-param-reassign: ["error", { "props": false }] */

const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');

const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

const { prune, clean } = require('../utils/subtrees');

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
    const originalSubtree = originalSubtrees.filter(t => t.name === subtree.name);
    if (!originalSubtree) {
      throw new Error(`Cannot find subtree for ${subtree.name}`);
    }
    const leafIds = subtree.collectionIds.concat(subtree.publicIds);
    subtree.tree = prune(subtree.tree, leafIds.filter(id => srcIds.has(id)), subtree.name);
    subtree.tree = clean(subtree.tree, leafIds.filter(id => destIds.has(id)), subtree.name);
    subtree.publicIds = subtree.publicIds.filter(id => !destIds.has(id));
    subtree.collectionIds = leafIds.filter(id => destIds.has(id));
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
