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
  }

  get size() {
    return {
      queue: this.queue.length,
      inProgress: this.inProgress.length,
      total: this.queue.length + this.inProgress.length
    };
  }

  wait() {
    if (this.isEmpty) return this.isEmpty;
    this.isEmpty = new Promise((res) => {
      this.onEmpty = res;
    });
    return this.isEmpty;
  }

  enqueue(...params) {
    const job = { params };
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

    if (this.inProgress.length >= this.maxWorkers) return undefined;
    if (this.queue.length === 0) return undefined;

    const job = this.queue.shift();
    this.inProgress.push(job);
    try {
      const r = await this.fn(...job.params);
      job.pass(r);
    } catch (err) {
      job.fail(err);
    }
    remove(this.inProgress, job);
    return this.__next();
  }
}

module.exports = Pool;
