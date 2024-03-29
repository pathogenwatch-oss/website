const LOGGER = require('utils/logging').createLogger('runner');

const argv = require('named-argv');
const os = require('os');
const fs = require('fs');

const { formatMemory } = require('manifest');
const { request } = require('services');
const pullTaskImage = require('services/tasks/pull');
const store = require('utils/object-store');

const MB = 1024 ** 2;
const DEFAULT_AVAILABLE_MEMORY = os.totalmem() - 500 * MB;
const DEFAULT_AVAILABLE_CPUS = os.cpus().length;

function sleep(t) {
  return new Promise((resolve) => setTimeout(() => resolve(), t));
}

const Queue = require('models/queue');
const { taskTypes } = require('manifest');

const {
  queue = 'normal',
  type,
  availableCPUs = DEFAULT_AVAILABLE_CPUS,
  once = 'false', // If true, it only runs one task.  Useful for debugging.
} = argv.opts;
const availableMemory = formatMemory(argv.opts.availableMemory || DEFAULT_AVAILABLE_MEMORY);
const availableSlow = Math.max(Math.floor(availableCPUs / 4), 1);

process.on('uncaughtException', (err) => console.error('uncaught', err));

const ResourceManager = require('services/resourceManager');

const resourceManager = new ResourceManager({ cpu: availableCPUs, memory: availableMemory, slow: availableSlow });

async function runJob(job, releaseResources) {
  try {
    const { spec, metadata, priority = 0, precache = false, retry = false } = job;
    const { taskType, timeout, task, version } = spec;

    try {
      await pullTaskImage(spec);
    } catch (err) {
      LOGGER.error(err);
      await Queue.requeue(job);
      return;
    }

    const ackOk = await Queue.ack(job);
    if (!ackOk) {
      // It might have taken a long time to pull the image and another runner
      // may have been given our task to run.  If that's the case we want
      // to return and fetch another job
      return;
    }

    if (taskType === taskTypes.assembly) {
      const { genomeId, clientId, userId, uploadedAt, readsKeys } = metadata;
      try {
        await request('genome', 'send-assembly-progress', { clientId, userId, uploadedAt });
        await request('tasks', 'run-assembly', { spec, timeout$: timeout * 1000 * 1.1, metadata });
        await Queue.handleSuccess(job);
        await request('genome', 'send-assembly-progress', { clientId, userId, uploadedAt });
        readsKeys.forEach(readKey => store.delete(readKey));
        // Delete the read files?
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        await request('genome', 'assembler-error', {
          id: genomeId,
          user: userId,
          error: 'problem assembling genome',
        });
        await request('genome', 'send-assembly-progress', { clientId, userId, uploadedAt });
      }
    } else if (taskType === taskTypes.genome) {
      try {
        await request('genome', 'speciate', { timeout$: timeout * 1000 * 1.1, spec, metadata, precache, priority });
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        if (!retry) {
          await request('genome', 'add-error', { spec, metadata });
        }
      }
    } else if (taskType === taskTypes.task) {
      try {
        await request('tasks', 'run', { spec, timeout$: timeout * 1000 * 1.1, metadata, precache });
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        if (!retry) {
          await request('genome', 'add-error', { spec, metadata });
        }
      }
    } else if (taskType === taskTypes.collection) {
      try {
        const { clientId, name } = metadata;
        await request('tasks', 'run-collection', {
          spec,
          metadata,
          priority,
          precache,
          timeout$: timeout * 1000 * 1.1,
        });
        LOGGER.info('Got result', metadata.collectionId, task, version);
        await request('collection', 'send-progress', { clientId, payload: { task, name, status: 'READY' } });
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        if (!retry) {
          await request('collection', 'add-error', { spec, metadata });
        }
      }
    } else if (taskType === taskTypes.clustering) {
      try {
        const result = await request('tasks', 'run-clustering', { spec, metadata, timeout$: timeout * 1000 * 1.1 });
        const { taskId } = metadata;
        LOGGER.info('Got result', spec.task, spec.version, metadata, result);
        await request('clustering', 'send-progress', { taskId, payload: { status: 'READY' } });
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
      }
    } else if (taskType === taskTypes.followOn) {
      try {
        await request('tasks', 'run-follow-on', { spec, timeout$: timeout * 1000 * 1.1, metadata, precache });
        await Queue.handleSuccess(job);
      } catch (err) {
        LOGGER.error(err);
        await Queue.handleFailure(job, err.message);
        if (!retry) {
          await request('genome', 'add-error', { spec, metadata });
        }
      }
    } else {
      const errMessage = `Don't know how to handle job of type ${taskType} (task=${task} version=${version})`;
      LOGGER.error(errMessage);
      await Queue.handleFailure(job, errMessage);
    }
  } finally {
    // Whatever happens, we must release the resources.
    releaseResources();
  }
}

async function subscribeToQueue(queueName, taskType) {
  const constraints = {};
  if (taskType) constraints['message.spec.taskType'] = taskType;
  const heartbeatFile = '/tmp/pw-worker-heartbeat';
  fs.writeFileSync(heartbeatFile, new Date().toISOString());

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const time = new Date();
    fs.utimesSync(heartbeatFile, time, time);

    // Check if pause file exists
    if (fs.existsSync('/tmp/pw/pause')) {
      LOGGER.info("Pause file found, not accepting tasks.");
      await sleep(5000);
      continue;
    }

    const limits = { ...resourceManager.available, slow: resourceManager.free.slow };
    // We're not even pulling slow jobs if there are too many running
    // Normally we'd pull a job and wait, but slow jobs from one use clog up the
    // service for other users.

    const job = await Queue.dequeue(
      limits, // Only give us a job which fits on this worker
      constraints, // Some additional constrains if we only want some tasks
      queueName // The queue to pull jobs from.
    );

    if (job === null) {
      LOGGER.info(`No jobs found in ${queueName} queue which fit on machine`, {
        available: resourceManager.available,
        free: resourceManager.free,
      });
      await sleep(2000);
      continue;
    }

    // This is intentionally not awaited, we're pulling the container
    // while we wait for the resources to run it.
    pullTaskImage(job.spec).catch((err) => LOGGER.error(`Problem pulling task=${job.spec.task} version=${job.spec.version}: ${err}`));

    LOGGER.debug({ job });

    // We don't want to keep waiting for resources if another worker will have
    // picked up this task.
    const whenResources = resourceManager.request(job.spec.resources);
    const isTimeout = await Promise.race([ request, sleep(job.ackWindow * 1000).then(() => 'timeout') ]) === 'timeout';
    if (isTimeout) {
      whenResources.then((release) => release());
      continue;
    }

    const releaseResources = await whenResources;

    // When we got the job, we were only granted exclusivity for a short window
    // That might be 30s or so.  We 'ack' the job to say that we're actually
    // ready to start running it.  This gives us more time to complete the task.
    const ackOk = await Queue.ack(job, false);
    if (!ackOk) {
      // It might have taken a long time to free up resources and another runner
      // may have been given our task to run.  If that's the case we release
      // the resources and ask for another job.
      releaseResources();
      continue;
    }

    const r = runJob(job, releaseResources); // Don't await this, we want to start another job if we can
    if (once === 'true') {
      LOGGER.warn("Exiting because called with --once='true' flag");
      return r;
    }
  }
}

module.exports = function () {
  return subscribeToQueue(queue, type);
};
