/* eslint no-param-reassign: 0 */

const LOGGER = require('utils/logging').createLogger('queue');

class ResourceManager {
  constructor (available) {
    this.available = available;
    this.allocated = {};
    this.queue = [];
    this.running = [];
    this.nextId = 0;
  }

  request(resources={}) {
    for (const key in resources) {
      if ((this.available[key] || 0) < resources[key]) {
        throw new Error(`key is limited to ${this.available[key]}; can never supply ${resources[key]}`)
      }
    }
    const job = {
      id: this.nextId++,
      resources,
    }

    const releaseFn = (() => this.release(job.id)).bind(this)
    const output = new Promise(resolve => {
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
    for (const key in job.resources) {
      if (this.available[key] === undefined) continue
      this.allocated[key] = Math.max(0, this.allocated[key] - job.resources[key])
    }
    this.__next();
  }

  __next() {
    if (this.queue.length === 0) return;
    
    const nextJob = this.queue[0];
    for (const key in nextJob.resources) {
      this.allocated[key] = this.allocated[key] || 0;
      if (this.available[key] < (this.allocated[key] + nextJob.resources[key])) return;
    }
    for (const key in nextJob.resources) {
      this.allocated[key] += nextJob.resources[key];
    }
    
    this.queue.shift();
    this.running.push(nextJob)
    nextJob.onReady()
  }
}

module.exports = ResourceManager


module.exports.dequeue = function (queue, fn, reject) {
  mQueue.registerWorker(queue, async (queueItem) => {
    LOGGER.info('Handling message', queueItem, 'from', queue);
    // await updateReceivableTime({ message: { timeout: 20 * 60 }});
    
    let releaseResources;
    try {
      const { resources } = queueItem.message || defaultResources;
      releaseResources = await resourceManager.request(resources);
    } catch (err) {
      queueItem.rejectionReason = 'Insufficient resources to run this task';
      if (reject) reject(queueItem.message);
      return 'Rejected';
    }

    try {
      await fn(queueItem.message);
      releaseResources();
      return 'Completed'
    } catch (err) {
      LOGGER.error(err);
      releaseResources();
      const { retries = 1 } = queueItem.message;
      queueItem.releasedReason = err.message;
      if ((queueItem.retryCount || 0) < retries - 1) {
        queueItem.nextReceivableTime = new Date(Date.now() + (30 * 1000));
        return 'Retry';
      }
      queueItem.rejectionReason = `Gave up after ${retries} retries.`;
      if (reject) reject(queueItem.message);
      return 'Rejected';
    }
  });
};
