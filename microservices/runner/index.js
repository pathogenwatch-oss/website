const LOGGER = require('utils/logging').createLogger('runner');

const argv = require('named-argv');

const { request } = require('services');
const pullTaskImages = require('services/tasks/pull');
const taskQueue = require('services/taskQueue');

const { queues } = taskQueue;
const { queue, pull = 1 } = argv.opts;

if (queue && !(queue in queues)) {
  LOGGER.error(`Queue ${queue} not recognised, exiting...`);
  process.exit(1);
}

process.on('uncaughtException', err => console.error('uncaught', err));

taskQueue.setMaxWorkers(argv.opts.workers || 1);

function subscribeToQueue(queueName) {
  if (queueName === queues.genome) {
    taskQueue.dequeue(
      queueName,
      ({ metadata, timeout }) => request('genome', 'speciate', { timeout$: timeout * 1000, metadata }),
      message => request('genome', 'add-error', message)
    );
  }

  if (queueName === queues.task) {
    taskQueue.dequeue(
      queueName,
      ({ task, version, timeout, metadata }) =>
        request('tasks', 'run', { task, version, timeout$: timeout * 1000, metadata }),
      message => request('genome', 'add-error', message)
    );
  }

  if (queueName === queues.collection) {
    taskQueue.dequeue(
      queueName,
      ({ spec, metadata, timeout }) =>
        request('tasks', 'run-collection', { spec, metadata, timeout$: timeout * 1000 })
          .then(result => {
            LOGGER.info('Got result', metadata.collectionId, spec.task, spec.version);
            return request('collection', 'add-analysis', { spec, metadata, result });
          }),
      message => request('collection', 'add-error', message)
    );
  }

  if (queueName === queues.clustering) {
    taskQueue.dequeue(
      queueName,
      ({ spec, metadata, timeout }) =>
        request('tasks', 'run-clustering', { spec, metadata, timeout$: timeout * 1000 })
          .then(results => {
            LOGGER.info('Got result', spec.task, spec.version, metadata);
            return request('clustering', 'upsert', { results, metadata });
          }),
      message => request('clustering', 'error', message)
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
      else Object.keys(queues).map(subscribeToQueue);
    });
};
