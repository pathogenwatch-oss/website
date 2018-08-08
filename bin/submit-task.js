const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');

require('services');
const Genome = require('models/genome');
const manifest = require('manifest.js');
const { enqueue } = require('services/taskQueue');

const limit = 1;

const { task } = argv.opts;
if (!task) {
  throw new Error('Task not provided');
}
const uploadedAt = new Date();

function parseQuery() {
  const { query = '{ "public": true }' } = argv.opts;
  return JSON.parse(query);
}

function fetchGenomes(query) {
  return Genome.find(query, { fileId: 1, 'analysis.speciator': 1 }).lean().limit(1);
}

function submitTasks(genomes) {
  return mapLimit(
    genomes,
    limit,
    ({ _id: genomeId, fileId, analysis }) => {
      const { organismId, speciesId, genusId } = analysis.speciator || {};
      const tasks = manifest.getTasksByOrganism(organismId, speciesId, genusId);

      const requestedTask = tasks.find(_ => _.task === task);

      if (requestedTask) {
        const { version, retries, timeout } = requestedTask;
        const metadata = {
          genomeId,
          fileId,
          organismId,
          speciesId,
          genusId,
          uploadedAt: new Date(uploadedAt),
        };
        return enqueue(
          'reprocessing',
          { task, version, retries, timeout, metadata },
          'task'
        );
      }
    }
  );
}

mongoConnection.connect()
  .then(parseQuery)
  .then(fetchGenomes)
  .then(submitTasks)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
