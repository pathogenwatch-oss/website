const LOGGER = require('utils/logging').createLogger('runner');

const argv = require('named-argv');

const { request } = require('services');
const pull = require('services/tasks/pull');
const taskQueue = require('services/taskQueue');

const { queue, workers = 1 } = argv.opts;

if (queue && !(queue in taskQueue.queues)) {
  LOGGER.error(`Queue ${queue} not recognised, exiting...`);
  process.exit(1);
}

taskQueue.setMaxWorkers(workers);

const { tasks, speciator } = taskQueue.queues;

function subscribeToQueues() {
  if (!queue || queue === 'tasks') {
    taskQueue.dequeue(tasks, ({ genomeId, organismId, speciesId, genusId, fileId, uploadedAt, task, version, clientId }) =>
      request('tasks', 'run', { organismId, speciesId, genusId, fileId, task, version })
        .then(result => {
          LOGGER.info('results', genomeId, task, version, result);
          return request('genome', 'add-analysis', { genomeId, uploadedAt, task, version, result, clientId });
        })
    );
  }

  if (!queue || queue === 'speciator') {
    taskQueue.dequeue(speciator, ({ genomeId, fileId, uploadedAt, task, version, clientId }) =>
      request('tasks', 'run', { fileId, task, version })
        .then(result => {
          LOGGER.info('results', genomeId, task, version, result);
          return request('genome', 'add-analysis', { genomeId, uploadedAt, task, version, result, clientId })
            .then(() => {
              const { organismId, speciesId, genusId } = result;
              return request('tasks', 'submit-genome', { genomeId, fileId, uploadedAt, organismId, speciesId, genusId, clientId })
            });
        })
    );
  }
}

module.exports = function () {
  pull({ queue })
    .catch(err => {
      LOGGER.error(err);
      process.exit(1);
    })
    .then(subscribeToQueues);
};
