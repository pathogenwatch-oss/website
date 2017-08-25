const argv = require('named-argv');
const mapLimit = require('promise-map-limit');

const mongoConnection = require('utils/mongoConnection');
const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

function getIds() {
  const { src, dest } = argv.opts;
  if (src && dest) {
    return { src, dest: dest.split(',') };
  }
  throw new Error('Missing args');
}

function getCollectionIds({ src, dest }) {
  return Promise.all([
    Collection.find({ uuid: src }, { _id: 1 }).lean().then(docs => docs.map(_ => _._id)),
    Collection.find({ uuid: { $in: dest } }, { _id: 1 }).lean().then(docs => docs.map(_ => _._id)),
  ]);
}

function getCollectionGenomes([ srcId, destIds ]) {
  console.log(destIds.length);
  return Promise.all([
    CollectionGenome.find({ _collection: srcId[0] }, { fileId: 1, userDefined: 1 }).lean(),
    CollectionGenome.find({ _collection: { $in: destIds } }, { fileId: 1 }).lean(),
  ]);
}

const limit = 100;
const referenceCount = 19;

function updateCollectionGenomes([ srcGenomes, destGenomes ]) {
  for (const d of destGenomes) {
    if (!srcGenomes.find(_ => _.fileId === d.fileId)) {
      console.log(d.fileId);
    }
  }
  console.log();
  for (const d of srcGenomes) {
    if (!destGenomes.find(_ => _.fileId === d.fileId)) {
      console.log(d.fileId);
    }
  }
  if (srcGenomes.length - referenceCount !== destGenomes.length) {
    throw new Error(`Genome count does not match. src: ${srcGenomes.length} dest: ${destGenomes.length}`);
  }

  return mapLimit(srcGenomes, limit, ({ _id, fileId, userDefined }) => {
    const dest = destGenomes.find(_ => _.fileId === fileId);
    if (!dest) {
      console.log(`Dest genome not found: ${_id}`);
      return Promise.resolve();
    }
    const reverseUserDefined = {};
    for (const key of Object.keys(userDefined).reverse()) {
      if (key) reverseUserDefined[key] = userDefined[key];
    }
    return CollectionGenome.update(
      { _id: dest._id },
      { $set: { userDefined: reverseUserDefined } }
    );
  });
}

mongoConnection.connect()
  .then(getIds)
  .then(getCollectionIds)
  .then(getCollectionGenomes)
  .then(updateCollectionGenomes)
  .then(() => { console.log('Done'); process.exit(0); })
  .catch(error => { console.error(error); process.exit(1); });
