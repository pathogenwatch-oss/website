const LOGGER = require('utils/logging').createLogger('throttle');

function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), t);
  });
}

class Throttle {
  constructor({ maxDelay = 100, minDelay = 5, initialDelay = 1000 / 75 } = {}) {
    this.delay = initialDelay;
    this.maxDelay = maxDelay;
    this.minDelay = minDelay;
    this.initialDelay = initialDelay;
    this.errors = 0;
    this.counterStart = new Date();
    this.last = Promise.resolve();
    this.ok = 0;
  }

  /* eslint-disable no-async-promise-executor */
  async wait() {
    this.last = new Promise(async (resolve) => {
      await this.last;
      this.__updateDelay();
      await sleep(this.delay);
      resolve();
    });
    return this.last;
  }

  fail() {
    this.errors += 1;
  }

  succeed() {
    this.ok += 1;
  }

  __updateDelay() {
    const before = this.delay;
    if (this.errors > 3) {
      this.delay *= this.delay < this.initialDelay ? 2 : 1.2;
      this.delay = this.delay > this.maxDelay ? this.maxDelay : this.delay;
      this.errors = 0;
      this.ok = 0;
    } else if (this.ok > 10) {
      if (this.errors > 0) {
        this.delay *= this.delay < this.initialDelay ? 2 : 1.2;
        this.delay = this.delay > this.maxDelay ? this.maxDelay : this.delay;
      } else {
        this.delay *= this.delay > (this.initialDelay * 2) ? 0.5 : 0.9;
        this.delay = this.delay < this.minDelay ? this.minDelay : this.delay;
      }
      this.errors = 0;
      this.ok = 0;
    }
    if (before < this.delay) LOGGER.debug(`Requests slowed to every ${this.delay} ms`);
    if (before > this.delay) LOGGER.debug(`Requests sped up to every ${this.delay} ms`);
  }
}

module.exports = Throttle;
