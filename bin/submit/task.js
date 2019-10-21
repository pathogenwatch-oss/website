const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');

require('services');
const Genome = require('models/genome');
const User = require('models/user');
const manifest = require('manifest.js');
const { enqueue } = require('services/taskQueue');

const limit = 1;

const { task, queue = 'reprocessing' } = argv.opts;
if (!task) {
  throw new Error('--task not provided');
}
const uploadedAt = new Date();

function parseQuery() {
  const { query = '{}' } = argv.opts;
  return JSON.parse(query);
}

function fetchGenomes(query) {
  return Genome.find(query, { fileId: 1, _user: 1, 'analysis.speciator': 1 }).lean();
  // .limit(1);
}

function submitTasks(genomes) {
  return mapLimit(genomes, limit, async ({ _id: genomeId, _user, fileId, analysis }) => {
    const { speciator = {} } = analysis;
    const user = await User.findById(_user, { flags: 1 });
    if (!user) return;
    const tasks = manifest.getTasksByOrganism(speciator, user);

    const requestedTask = tasks.find(_ => _.task === task);
    console.log(task, requestedTask);

    const { organismId, speciesId, genusId, superkingdomId } = speciator;
    if (requestedTask) {
      const { version, retries, timeout } = requestedTask;
      const metadata = {
        genomeId,
        fileId,
        organismId,
        speciesId,
        genusId,
        superkingdomId,
        uploadedAt: new Date(uploadedAt),
      };
      return enqueue(queue, { task, version, retries, timeout, metadata }, 'task');
    }
  });
}

mongoConnection
  .connect()
  .then(parseQuery)
  .then(fetchGenomes)
  .then(submitTasks)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });