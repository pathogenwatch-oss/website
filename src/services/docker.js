const LOGGER = require('utils/logging').createLogger('container');

const { PassThrough, Writable } = require("stream");
const Docker = require('dockerode');

const docker = new Docker();
class Demux extends Writable {
  constructor(container) {
    super();
    this.container = container;
    this.buffer = Buffer.from('');
    this.nextDataType = null;
    this.nextDataLength = null;
  }

  bufferSlice(length) {
    const out = this.buffer.slice(0, length);
    this.buffer = Buffer.from(this.buffer.slice(length, this.buffer.length));
    return out;
  }

  _write(data, _, done) {
    this.buffer = Buffer.concat([this.buffer, data]);
    while (this.buffer.length > 8) {
      if (!this.nextDataType) {
        const header = this.bufferSlice(8);
        this.nextDataType = header.readUInt8(0);
        this.nextDataLength = header.readUInt32BE(4);
      }
      if (this.buffer.length < this.nextDataLength) return done();
      const content = this.bufferSlice(this.nextDataLength);
      if (this.nextDataType === 1) {
        this.container.stdout.write(content);
      } else {
        this.container.stderr.write(content);
      }
      this.nextDataType = null;
    }
    return done();
  }

  _final(cb) {
    this.container.stdout.end();
    this.container.stderr.end();
    cb();
  }
}

function addStdio(container) {
  container.stdout = new PassThrough();
  container.stderr = new PassThrough();
  container.stdin = new PassThrough();

  const handler = new Demux(container);

  container.attach({ stream: true, hijack: true, stdout: true, stderr: true, stdin: true }).then((stream) => {
    stream.on('error', (...args) => {
      container.stdout.emit('error', ...args);
      container.stderr.emit('error', ...args);
    });

    container.stdin.on('error', (...args) => {
      container.stdout.emit('error', ...args);
      container.stderr.emit('error', ...args);
    });

    stream.pipe(handler);
    container.stdin.pipe(stream);
  });

}

module.exports = async function (image, environment, timeout, resources, dockerOpts = {}) {
  const { Env = [], HostConfig = {}, ...otherOpts } = dockerOpts;
  if (process.env.KEEP_TASK_CONTAINERS !== 'true') HostConfig.AutoRemove = HostConfig.AutoRemove || true;

  const opts = {
    Image: image,

    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    OpenStdin: true,
    StdinOnce: true,

    Env,
    HostConfig,
    ...otherOpts,
  };

  if (resources.memory) {
    opts.HostConfig.Memory = resources.memory;
    opts.HostConfig.MemorySwap = resources.memory;
  }

  for (const key of Object.keys(environment)) opts.Env.push(`${key}=${environment[key]}`);

  const container = await docker.createContainer(opts);
  addStdio(container);

  if (timeout) {
    const t = setTimeout(() => {
      LOGGER.warn(`Container '${image}' (${container.id.slice(0, 8)}) timed out after ${timeout} milliseconds`);
      container.stop();
    }, timeout);
    container.wait().then(() => clearTimeout(t));
  }
  // container.wait().then(() => container.stop());
  return container;
};
