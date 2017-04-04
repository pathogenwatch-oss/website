const LOGGER = require('utils/logging').createLogger('runner');

const getServicesByOrganism = require('./manifest');
const queue = require('./queue');

function enqueueGenome([ { _id, _file }, services ]) {
  LOGGER.info(
    `Submitting tasks ${services.map(_ => _.task)} for genome ${_id}`
  );
  for (const { task, version } of services) {
    queue.enqueue({
      genomeId: _id,
      fileId: _file.fileId,
      task,
      version,
    });
  }
}

module.exports = function (genome) {
  return Promise.all([
    genome.populate('_file'),
    getServicesByOrganism(genome.organismId),
  ])
  .then(enqueueGenome);
};
