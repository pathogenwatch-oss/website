const LOGGER = require('utils/logging').createLogger('concurrentWorkers');

function remove(arr, el) {
  const index = arr.indexOf(el);
  if (index > -1) arr.splice(index, 1);
}

class Pool {
  constructor(fn, maxWorkers = 5) {
    this.fn = fn;
    this.maxWorkers = maxWorkers;
    this.inProgress = [];
    this.queue = [];
    this.onEmpty = null;
    this.isEmpty = null;
    this.token = 0;

    this.zombieLand = [];
    this.killed = 0;
    this.zombieFarmer = null;
  }

  get size() {
    return {
      queue: this.queue.length,
      inProgress: this.inProgress.length,
      zombies: this.zombieLand.length,
      total: this.queue.length + this.inProgress.length + this.zombieLand.length,
    };
  }

  wait() {
    if (this.isEmpty) return this.isEmpty;
    if (this.size.queue + this.size.inProgress === 0) return Promise.resolve();
    this.isEmpty = new Promise((res) => {
      this.onEmpty = res;
    });
    return this.isEmpty;
  }

  enqueue(...params) {
    this.token += 1;
    const job = { token: this.token, created: new Date(), params };
    // eslint-disable-next-line
    const output = new Promise((resolve, reject) => {
      job.pass = (v) => resolve(v);
      job.fail = (e) => reject(e);
    });
    this.queue.push(job);
    this.__next();
    return output;
  }

  async __next() {
    const jobCount = this.inProgress.length + this.queue.length;
    if (jobCount === 0 && this.onEmpty !== null) this.onEmpty();

    if (this.size.total === 0 && this.zombieFarmer !== null) {
      clearInterval(this.zombieFarmer);
      this.zombieFarmer = null;
    }

    if (this.inProgress.length >= this.maxWorkers) return undefined;
    if (this.queue.length === 0) return undefined;

    const job = this.queue.shift();
    this.inProgress.push(job);
    if (this.zombieFarmer === null) this.zombieFarmer = setInterval(() => this.farmZombies(), 2000);
    try {
      job.started = new Date();
      const r = await this.fn(...job.params);
      job.pass(r);
    } catch (err) {
      job.fail(err);
    }
    remove(this.inProgress, job);
    return this.__next();
  }

  farmZombies() {
    // For whatever reason, tasks sometimes don't finsh and they clog the "inProgress"
    // This function moves those tasks to zombieLand so that other tasks can keep running
    // Tasks then have an hour to recover before they are killed.

    const now = new Date();
    const before = this.killed;

    while (this.queue.length > 0) {
      const job = this.queue[0];
      if ((now - job.created) < 600000) break;
      this.killed += 1;
      job.fail(new Error('Job took over 10 mins to start; killed'));
      this.queue.shift(); // remove the job;
    }

    while (this.inProgress.length > 0) {
      const job = this.inProgress[0];
      if ((now - job.started) < 60000) break;
      this.inProgress.shift(); // remove the job;
      this.zombieLand.push(job);
      this.__next();
    }

    while (this.zombieLand.length > 0) {
      const job = this.zombieLand[0];
      if ((now - job.started) < 3600000) break;
      this.killed += 1;
      job.fail(new Error('Job took over an hour to complete; killed'));
      this.zombieLand.shift(); // remove the job;
    }

    // I added this code because there was a problem with a bulk upload of data to the new server.
    // Data was being sent to a web service and the connection timed out.  The data was being added
    // to the object store as a stream but it didn't seem to notice that the data it was piping
    // had crashed because the request was terminated.  This left a lot of tasks 'inProgress' which
    // were never succeeding or failing and this blocked anything else from uploading data.

    // This process is a failsafe so that the 'inProgress' queue is eventually cleared up and more
    // data can be injested.  The root cause of blockages should still be addressed because this
    // is a bit performance killer.
    if (before < this.killed) LOGGER.warn(`${this.killed - before} tasks have been killed because they were taking too long to complete`);
  }
}

module.exports = Pool;
