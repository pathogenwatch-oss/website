const fs = require('fs');
const argv = require('named-argv');
const path = require('path');

const Collection = require('models/collection');
const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const Organism = require('models/organism');
const { request } = require('services');
const mongoConnection = require('utils/mongoConnection');

const readCsv = require('../utils/read-csv');
const storeGenomes = require('../utils/store-genomes');

const organisms = require('pathogenwatch-front-end/universal/organisms');

const { organismId, csvFile, fastaDir } = argv.opts;

console.log({ organismId, csvFile, fastaDir });

if (!organismId || !csvFile || !fastaDir) {
  console.log('Missing arguments');
  process.exit(1);
}

const organism = organisms.find(_ => _.id === organismId);

if (!organism) {
  console.log('Organism not found');
  process.exit(1);
}

function getGenomeFile({ filename }) {
  return Promise.resolve(fs.createReadStream(path.join(fastaDir, filename)));
}

function addDummyOrganismRecord() {
  return Organism.create({
    taxId: organismId,
    deployed: new Date(),
    resistance: {
      antibiotics: [],
      paar: {},
      snp: {},
    },
  });
}

function submitCollectionGenomes(collectionId, uuidToGenome) {
  const { speciesId, genusId } = organism;
  return Promise.all(uuidToGenome.map(([ genomeId, genome ]) => {
    const { fileId, uploadedAt } = genome;
    return request('tasks', 'submit-genome', { genomeId, collectionId, fileId, uploadedAt, organismId, speciesId, genusId });
  }));
}

function createReferenceCollection() {
  return (
    readCsv(csvFile)
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
            submitCollectionGenomes(collection.uuid, uuidToGenome),
          ])
        )
      )
  );
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
  .then(() => (
    organism.simple ?
      addDummyOrganismRecord() :
      createReferenceCollection()
  ))
  .then(() => process.exit(0))
  .catch(console.error)
    .then(() => process.exit(1));
