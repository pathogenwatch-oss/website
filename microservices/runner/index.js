const LOGGER = require('utils/logging').createLogger('runner');

const { request } = require('services');
const queue = require('services/taskQueue');

function onMessage({ genomeId, organismId, fileId, task, version }) {
  return (
    request('tasks', 'run', { organismId, fileId, task, version })
      .then(result => {
        LOGGER.info('results', genomeId, task, result);
        return request('genome', 'add-analysis', { genomeId, task, result });
      })
  );
}

module.exports = function () {
  queue.dequeue(onMessage);
};
