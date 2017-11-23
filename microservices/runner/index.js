const LOGGER = require('utils/logging').createLogger('runner');

const argv = require('named-argv');

const { request } = require('services');
const pullTaskImages = require('services/tasks/pull');
const taskQueue = require('services/taskQueue');

const { queue, workers = 1, pull = 1 } = argv.opts;

if (queue && !(queue in taskQueue.queues)) {
  LOGGER.error(`Queue ${queue} not recognised, exiting...`);
  process.exit(1);
}

process.on('uncaughtException', err => console.error('uncaught', err));

taskQueue.setMaxWorkers(workers);

const { tasks, speciator, collections } = taskQueue.queues;

function subscribeToQueue(queueName) {
  if (queueName === speciator) {
    taskQueue.dequeue(
      queueName,
      ({ metadata }) => request('genome', 'speciate', metadata),
      message => request('genome', 'add-error', message)
    );
  }

  if (queueName === tasks || queueName === speciator) {
    taskQueue.dequeue(
      queueName,
      ({ genomeId, collectionId, organismId, speciesId, genusId, fileId, uploadedAt, task, version, clientId, timeout }) =>
        request('tasks', 'run', { organismId, speciesId, genusId, fileId, task, version, timeout$: timeout * 1000 })
          .then(() => {
            LOGGER.info('Got result', genomeId, collectionId, task, version);
            return request('genome', 'add-analysis', { genomeId, fileId, collectionId, uploadedAt, task, version, clientId });
          }),
      message => request('genome', 'add-error', message)
    );
  }

  if (queueName === collections) {
    taskQueue.dequeue(
      queueName,
      ({ task, version, requires, collectionId, metadata, clientId, timeout }) =>
        request('tasks', 'run-collection', { task, version, requires, collectionId, metadata, clientId, timeout$: timeout * 1000 })
          .then(result => {
            LOGGER.info('Got result', collectionId, task, version);
            return request('collection', 'add-analysis', { collectionId, task, version, result, metadata, clientId });
          }),
      message => request('collection', 'add-error', message)
    );
  }
}

function pullImages() {
  if (pull === '0') return Promise.resolve();
  return pullTaskImages({ queue })
    .catch(err => {
      LOGGER.error(err);
      process.exit(1);
    });
}

module.exports = function () {
  pullImages()
    .then(() => {
      if (queue) subscribeToQueue(queue);
      else Object.keys(taskQueue.queues).map(subscribeToQueue);
    });
};
