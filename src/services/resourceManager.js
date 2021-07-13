/* eslint no-param-reassign: 0 */

class ResourceManager {
  constructor(available) {
    this.available = available;
    this.allocated = {};
    this.queue = [];
    this.running = [];
    this.nextId = 0;
  }

  get free() {
    const freeResources = { ...this.available };
    for (const key of Object.keys(freeResources)) freeResources[key] = Math.max(freeResources[key] - (this.allocated[key] || 0), 0);
    return freeResources;
  }

  request(resources = {}) {
    for (const key in resources) {
      if ((this.available[key] || 0) < resources[key]) {
        throw new Error(`key is limited to ${this.available[key]}; can never supply ${resources[key]}`);
      }
    }
    const job = {
      id: this.nextId,
      resources,
    };
    this.nextId += 1;

    const releaseFn = (() => this.release(job.id));
    const output = new Promise((resolve) => {
      job.onReady = () => resolve(releaseFn);
    });

    this.queue.push(job);
    this.__next();
    return output;
  }

  release(jobId) {
    const job = this.running.find((j) => j.id === jobId);
    if (job === undefined) return this.__next();

    this.running = this.running.filter((j) => j.id !== jobId);
    for (const key in job.resources) {
      if (this.available[key] === undefined) continue;
      this.allocated[key] = Math.max(0, this.allocated[key] - job.resources[key]);
    }
    return this.__next();
  }

  __next() {
    if (this.queue.length === 0) return;

    const nextJob = this.queue[0];
    for (const key of Object.keys(nextJob.resources)) {
      this.allocated[key] = this.allocated[key] || 0;
      if (this.available[key] < (this.allocated[key] + nextJob.resources[key])) return;
    }
    for (const key of Object.keys(nextJob.resources)) {
      this.allocated[key] += nextJob.resources[key];
    }

    this.queue.shift();
    this.running.push(nextJob);
    nextJob.onReady();
  }
}

module.exports = ResourceManager;
