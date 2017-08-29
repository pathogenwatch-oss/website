/* eslint no-param-reassign: 0 */
/* eslint max-len: 0 */
/* eslint no-console: 0 */

const argv = require('named-argv');

const mongoConnection = require('utils/mongoConnection');
const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
const mapLimit = require('promise-map-limit');

const { prune, clean } = require('../utils/subtrees');

function getIds() {
  const { src, dest } = argv.opts;
  if (src && dest) {
    return { src: src.split(','), dest };
  }
  throw new Error('Missing args');
}

function getCollections({ src, dest }) {
  return Promise.all([
    Collection.find({ uuid: { $in: src } }, { _id: 1 }).lean().then(docs => docs.map(_ => _._id)),
    Collection.findOne({ uuid: dest }),
  ]);
}

function getCollectionGenomes([ srcIds, destCollection ]) {
  return Promise.all([
    CollectionGenome.find({ _collection: { $in: srcIds } }, { uuid: 1, fileId: 1 }).lean(),
    CollectionGenome.find({ _collection: destCollection._id }, { uuid: 1, fileId: 1 }).lean(),
  ])
  .then(([ srcGenomes, destGenomes ]) => [ destCollection, srcGenomes, destGenomes ]);
}

function updateCollectionTree([ destCollection, srcGenomes, destGenomes ]) {
  if (srcGenomes.length !== destGenomes.length) {
    throw new Error(`Genome count does not match. src: ${srcGenomes.length} dest: ${destGenomes.length}`);
  }

  const srcUuidByFileId = srcGenomes.reduce((p, c) => { p[c.uuid] = c.fileId; return p; }, {});
  const destFileIds = new Set(destGenomes.map(x => x.fileId));

  for (const subtree of destCollection.subtrees) {
    const duplicatedIds = subtree.publicIds.filter(id => destFileIds.has(srcUuidByFileId[id]));
    subtree.tree = prune(subtree.tree, duplicatedIds, subtree.name);
    subtree.tree = clean(subtree.tree, subtree.collectionIds, subtree.name);
    subtree.publicIds = subtree.publicIds.filter(id => !duplicatedIds.includes(id));
    subtree.totalPublic = subtree.publicIds.length;
  }

  for (const destGenome of destGenomes) {
    const srcGenome = srcGenomes.find(x => x.fileId === destGenome.fileId);
    if (!srcGenome) {
      throw new Error(`Cannot file genome with fileId ${destGenome.fileId}`);
    }
    destCollection.tree = destCollection.tree.replace(destGenome.uuid, srcGenome.uuid);

    for (const subtree of destCollection.subtrees) {
      subtree.tree = subtree.tree.replace(destGenome.uuid, srcGenome.uuid);
      for (let i = 0; i < subtree.publicIds.length; i++) {
        if (subtree.publicIds[i] === destGenome.uuid) {
          subtree.publicIds[i] = srcGenome.uuid;
        }
      }
      for (let i = 0; i < subtree.collectionIds.length; i++) {
        if (subtree.collectionIds[i] === destGenome.uuid) {
          subtree.collectionIds[i] = srcGenome.uuid;
        }
      }
    }
  }

  destCollection.published = true;

  return [ destCollection, srcGenomes, destGenomes ];
}

function save([ destCollection, srcGenomes, destGenomes ]) {
  return Promise.all([
    destCollection.save(),
    mapLimit(
      srcGenomes,
      100,
      ({ _id }) => CollectionGenome.update({ _id }, { $set: { _collection: destCollection._id } })
    ),
    mapLimit(
      destGenomes,
      100,
      ({ _id }) => CollectionGenome.remove({ _id })
    ),
  ]);
}

mongoConnection.connect()
  .then(getIds)
  .then(getCollections)
  .then(getCollectionGenomes)
  .then(updateCollectionTree)
  .then(save)
  .then(() => { console.log('Done'); process.exit(0); })
  .catch(error => { console.error(error); process.exit(1); });
