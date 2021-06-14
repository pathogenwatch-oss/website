/* eslint no-param-reassign: 0 */

const MessageQueue = require('mongo-message-queue');
const mQueue = new MessageQueue();
const Q = require('q');
const mongoose = require('mongoose');
const Queue = require('../models/queue');

const config = require('configuration');
const LOGGER = require('utils/logging').createLogger('queue');

const defaultRetries = config.tasks.retries || 3;
const defaultTimeout = config.tasks.timeout || 30;

mQueue.processingTimeout = (defaultTimeout || 60) * 1000;
mQueue.maxWorkers = 1;

mQueue.databasePromise = () => Q.resolve(mongoose.connection);

const queues = {
  clustering: 'clustering',
  collection: 'collection',
  genome: 'genome',
  task: 'task',
};

module.exports.Queue = Queue;
module.exports.queues = queues;

class ResourceManager {
  constructor (available) {
    this.available = available;
    this.allocated = {};
    this.queue = [];
    this.running = [];
    this.nextId = 0;
  }

  request(resources) {
    for (const key in resources) {
      if ((this.available[key] || 0) < resources[key]) {
        throw new Error(`key is limited to ${this.available[key]}; can never supply ${resources[key]}`)
      }
    }
    const job = {
      id = this.nextId++,
      resources,
    }

    const releaseFn = (() => this.release(job.id)).bind(this)
    output = new Promise(resolve => {
      job.onReady = () => resolve(releaseFn);
    })

    this.queue.push(job);
    this.__next();
    return output
  }

  release(jobId) {
    const job = this.running.find(j => j.id == jobId);
    if (job === undefined) return this.__next();

    this.running = this.running.filter(j => j.id !== jobId);
    for (const key of job.resources) {
      if (this.available[key] === undefined) continue
      this.allocated[key] = Math.min(this.available[key], this.allocated[key] + job.resources[key])
    }
    this.__next();
  }

  __next() {
    if (this.queue.length === 0) return;
    
    const nextJob = this.queue[0];
    for (const key of nextJob.resources) {
      if (this.available[key] < (this.allocated[key] + nextJob.resources[key])) return;
    }
    
    this.queue.shift();
    this.running.push(nextJob)
    nextJob.onReady()
  }
}

let resources;
module.exports.setResources = (r) => {
  resources = new ResourceManager(r);
}

module.exports.enqueue = function (queue, message, type = queue) {
  if (!(type in queues)) {
    LOGGER.error(`Queue type ${type} not recognised.`);
    throw new Error(`Queue type ${type} not recognised.`);
  }
  LOGGER.info('Adding message', message, 'to', queue);
  const { spec = {} } = message;
  return (
    mQueue.enqueue(queue, Object.assign(
      message, {
        retries: spec.retries || defaultRetries,
        timeout: spec.timeout || defaultTimeout,
      }
    ))
    .catch(err => LOGGER.error(err))
  );
};

async function updateReceivableTime(queueItem) {
  const { timeout } = (queueItem.message || {});
  if (!timeout) return;
  const db = await mQueue.databasePromise();
  const collection = db.collection(mQueue.collectionName);
  const nextReceivableTime = new Date(queueItem.receivedTime.getTime() + (timeout * 1000));
  try {
    await collection.update({ _id: queueItem._id }, { $set: { nextReceivableTime } });
  } catch (err) {
    return;
  }
}

module.exports.dequeue = function (queue, callback, reject) {
  mQueue.registerWorker(queue, (queueItem) => {
    LOGGER.info('Handling message', queueItem, 'from', queue);
    return updateReceivableTime(queueItem)
      .then(() => callback(queueItem.message))
      .then(() => 'Completed')
      .catch(err => {
        LOGGER.error(err);
        const { retries = 1 } = queueItem.message;
        queueItem.releasedReason = err.message;
        if ((queueItem.retryCount || 0) < retries - 1) {
          queueItem.nextReceivableTime = new Date(Date.now() + (30 * 1000));
          return 'Retry';
        }
        queueItem.rejectionReason = `Gave up after ${retries} retries.`;
        if (reject) reject(queueItem.message);
        return 'Rejected';
      });
  });
};
