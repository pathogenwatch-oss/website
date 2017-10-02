/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: 0 */
/* eslint max-len: 0 */

const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');

const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

const { prune, clean } = require('../utils/subtrees');

function parseQuery() {
  const { id } = argv.opts;
  if (!id) {
    throw new Error('Missing args');
  }
  return id;
}

function fetchCollections(collectionId) {
  return (
    Collection.findByUuid(collectionId)
  );
}

function fetchCollectionGenomes(collection) {
  const collectionIds = collection.subtrees.reduce((p, c) => p.concat(c.collectionIds), []);
  const publicIds = collection.subtrees.reduce((p, c) => p.concat(c.publicIds), []);
  return Promise.all([
    CollectionGenome.find({ uuid: { $in: collectionIds } }, { uuid: 1, fileId: 1 }).lean(),
    CollectionGenome.find({ uuid: { $in: publicIds } }, { uuid: 1, fileId: 1 }).lean(),
  ])
  .then(([ collectionGenomes, publicGenomes ]) => [ collection, collectionGenomes, publicGenomes ]);
}

function trimSubtrees([ collection, collectionGenomes, publicGenomes ]) {
  const publicIdsToFileids = publicGenomes.reduce((p, c) => { p[c.uuid] = c.fileId; return p; }, {});
  const collectionFileIds = new Set(collectionGenomes.map(x => x.fileId));
  const collectionIdsToFileids = collectionGenomes.reduce((p, c) => { p[c.uuid] = c.fileId; return p; }, {});
  const publicFileIds = new Set(publicGenomes.map(x => x.fileId));

  for (const subtree of collection.subtrees) {
    const duplicatedPublicIds = subtree.publicIds.filter(id => collectionFileIds.has(publicIdsToFileids[id]));
    const duplicatedCollectionIds = subtree.collectionIds.filter(id => publicFileIds.has(collectionIdsToFileids[id]));
    console.log('removing %s\t duplicated leaves from subtree %s', duplicatedPublicIds.length, subtree.name);
    if (duplicatedPublicIds.length !== duplicatedCollectionIds.length) {
      throw new Error(`Duplicated leaves count does not match: ${duplicatedPublicIds.length} ${duplicatedCollectionIds.length}`)
    }
    subtree.tree = prune(subtree.tree, duplicatedPublicIds, subtree.name);
    subtree.tree = clean(subtree.tree, duplicatedCollectionIds, subtree.name);
    subtree.publicIds = subtree.publicIds.filter(id => !duplicatedPublicIds.includes(id));
    subtree.totalPublic = subtree.publicIds.length;
  }

  return [ collection, collectionGenomes, publicGenomes ];
}

function saveCollection([ collection ]) {
  return collection.save();
}

mongoConnection.connect()
  .then(parseQuery)
  .then(fetchCollections)
  .then(fetchCollectionGenomes)
  .then(trimSubtrees)
  .then(saveCollection)
  .then(() => console.log('Done'))
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
