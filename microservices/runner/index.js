const LOGGER = require('utils/logging').createLogger('runner');

const argv = require('named-argv');
const os = require('os');

const { request } = require('services');
const pullTaskImages = require('services/tasks/pull');

const MB = 1024 ** 2;
const DEFAULT_AVAILABLE_MEMORY = Math.floor(os.totalmem() / MB) - 500 * MB
const DEFAULT_AVAILABLE_CPUS = os.cpus().length;

const Queue, { taskTypes } = require('models/queue');
const { queue = 'normal', type, pull = 1, precache = false, availableMemory = DEFAULT_AVAILABLE_MEMORY, availableCPUs = DEFAULT_AVAILABLE_CPUS } = argv.opts;

process.on('uncaughtException', (err) => console.error('uncaught', err));

const ResourceManager = require('services/resourceManager')
const resourceManager = new ResourceManager({ cpu: availableCPUs, memory: availableMemory });

async function runJob(job, releaseResources) {
  try {
    const { message = {} } = job;
    const { taskType = taskTypes.task } = message;
  
    if (taskType === taskTypes.genome) {
      try {
        const { metadata, timeout } = message;
        await request('genome', 'speciate', { timeout$: timeout * 1000, metadata, precache })
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        await request('genome', 'add-error', message)
      }
    }
  
    else if (taskType === taskTypes.task) {
      try {
        const { task, version, timeout, metadata } = message;
        await request('tasks', 'run', { task, version, timeout$: timeout * 1000, metadata, precache })
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        await request('genome', 'add-error', message);
      }
    }
  
    else if (taskType === taskTypes.collection) {
      try {
        const { spec, metadata, timeout } = message;
        const result = await request('tasks', 'run-collection', { spec, metadata, timeout$: timeout * 1000 });
        LOGGER.info('Got result', metadata.collectionId, spec.task, spec.version);
        await request('collection', 'add-analysis', { spec, metadata, result });
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        await request('collection', 'add-error', message);
      }
    }
  
    else if (taskType === taskTypes.clustering) {
      try {
        const { spec, metadata, timeout } = message;
        await await request('tasks', 'run-clustering', { spec, metadata, timeout$: timeout * 1000 });
        const { taskId } = metadata;
        LOGGER.info('Got result', spec.task, spec.version, metadata);
        await request('clustering', 'send-progress', { taskId, payload: { status: 'READY' } });
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
      }
    }
  
    else {
      const errMessage = `Don't know how to handle job of type ${taskType}`
      LOGGER.error(errMessage);
      await Queue.handleFailure(job, errMessage);
    }
  } finally {
    // Whatever happens, we must release the resources.
    releaseResources();
  }
}

function subscribeToQueue(queueName, taskType) {
  const constraints = {};
  if (taskType) constraints['message.taskType'] = taskType;
  while (true) {
    const job = Queue.dequeue(
      resourceManager.available, // Only give us a job which fits on this worker
      constraints, // Some additional constrains if we only want some tasks
      queueName // The queue to pull jobs from.
    )

    const releaseResources = resourceManager.request(job.resources);

    // When we got the job, we were only granted exclusivity for a short window
    // That might be 30s or so.  We 'ack' the job to say that we're actually
    // ready to start running it.  This gives us more time to complete the task.
    const ackOk = await Queue.ack(job);
    if (!ackOk) {
      // It might have taken a long time to free up resources and another runner
      // may have been given our task to run.  If that's the case we release
      // the resources and ask for another job.
      releaseResources();
      continue;
    }

    runJob(job, releaseResources) // Don't await this, we want to start another job if we can
  }
}

function pullImages() {
  if (pull === '0') return Promise.resolve();
  return pullTaskImages({ taskType: type })
    .catch((err) => {
      LOGGER.error(err);
      process.exit(1);
    });
}

module.exports = function () {
  pullImages()
    .then(() => {
      if (queue) subscribeToQueue(queue, type);
      else Object.keys(taskTypes).map((queueName) => subscribeToQueue(queueName));
    });
};
