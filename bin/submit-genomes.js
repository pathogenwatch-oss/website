const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');

require('services');
const Genome = require('models/genome');
const submit = require('services/tasks/submit-genome');

const limit = 1000;

function parseQuery() {
  const { query = '{ "analysis.speciator": { "$exists": false } }' } = argv.opts;
  return JSON.parse(query);
}

function fetchGenomes(query) {
  return Genome.find(query, { fileId: 1 }).lean();
}

function submitGenomes(genomes) {
  return mapLimit(
    genomes,
    limit,
    ({ _id, fileId }) => submit({ genomeId: _id, fileId })
  );
}

mongoConnection.connect()
  .then(parseQuery)
  .then(fetchGenomes)
  .then(submitGenomes)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
