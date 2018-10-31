const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');

require('services');
const Collection = require('../src/models/collection');
const CollectionGenome = require('../src/models/collectionGenome');
const { request } = require('services/bus');

const organisms = require('pathogenwatch-front-end/universal/organisms');

const limit = 1000;

function parseQuery() {
  const { query = '{ "public": true }' } = argv.opts;
  return JSON.parse(query);
}

function fetchGenomes(query) {
  return Collection
    .find(query, { _id: 1, organismId: 1, uuid: 1 })
    .lean()
    .then(results => mapLimit(
      results,
      1,
      ({ _id, organismId, uuid }) =>
        CollectionGenome.find({ _collection: _id }, { uuid: 1, fileId: 1 })
          .lean()
          .then(genomes => ({
            collectionId: 'silent' in argv.opts ? true : uuid,
            organismId,
            genomes,
          })
        )
    ));
}

function submitCollections(collections) {
  return mapLimit(
    collections,
    1,
    ({ organismId, collectionId, genomes }) =>
      mapLimit(
        genomes,
        limit,
        genome => {
          const { fileId } = genome;
          const genomeId = genome.uuid;
          const { speciesId, genusId } = organisms.find(_ => _.id === organismId);
          return request('tasks', 'submit-genome', {
            genomeId,
            collectionId,
            fileId,
            uploadedAt: new Date(),
            organismId,
            speciesId,
            genusId,
          });
        }
      )
    );
}

mongoConnection.connect()
  .then(parseQuery)
  .then(fetchGenomes)
  .then(submitCollections)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
