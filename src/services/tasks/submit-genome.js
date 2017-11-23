const { enqueue, queues } = require('../taskQueue');

const { getSpeciatorTask } = require('../../manifest');

module.exports = function (metadata) {
  const speciatorTask = getSpeciatorTask();
  const { task, version } = speciatorTask;
  return enqueue(queues.speciator, { task, version, metadata });
};
