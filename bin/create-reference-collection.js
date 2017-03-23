const fs = require('fs');
const argv = require('named-argv');
const path = require('path');

const Collection = require('models/collection');
const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const { request } = require('services');
const mongoConnection = require('utils/mongoConnection');

const readCsv = require('../utils/read-csv');
const storeGenomes = require('../utils/store-genomes');

const {
  organismId,
  csvFile,
  fastaDir,
} = argv.opts;

console.log({ organismId, csvFile, fastaDir });

if (!organismId || !csvFile || !fastaDir) {
  console.log('Missing arguments');
  process.exit(1);
}

function getGenomeFile({ filename }) {
  return Promise.resolve(fs.createReadStream(path.join(fastaDir, filename)));
}

mongoConnection.connect()
  .then(() => Promise.all([
    Genome.remove({ organismId, reference: true }),
    Collection.findOne({ uuid: organismId, reference: true })
      .then(collection => (
        collection ?
          Promise.all([
            collection.remove(),
            CollectionGenome.remove({ _collection: collection._id }),
          ]) :
          Promise.resolve()
        )),
  ]))
  .then(() => readCsv(csvFile))
  .then(rows => storeGenomes(rows, getGenomeFile, { reference: true }))
  .then(uuidToGenome =>
    Collection.create({
      size: uuidToGenome.length,
      organismId,
      title: `temp ${organismId} reference collection`,
      reference: true,
    })
    .then(collection =>
      Promise.all([
        collection.addUUID(organismId),
        request('collection', 'add-genomes', { collection, uuidToGenome }),
      ])
    )
  )
  .then(() => process.exit(0))
  .catch(console.error)
    .then(() => process.exit(1));
