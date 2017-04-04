const LOGGER = require('utils/logging').createLogger('runner');

const getServicesByOrganism = require('./manifest');
const queue = require('./queue');

function enqueueGenome([ genome, services ]) {
  LOGGER.info(
    `Submitting tasks [${services.map(_ => _.task)}] for genome ${genome.id}`
  );

  for (const { task, version, retries } of services) {
    queue.enqueue({
      genomeId: genome.id,
      fileId: genome._file.fileId,
      task,
      version,
      retries,
    });
  }
}

module.exports = function (genome) {
  return Promise.all([
    genome.populate('_file').execPopulate(),
    getServicesByOrganism(genome.organismId),
  ])
  .then(enqueueGenome);
};
