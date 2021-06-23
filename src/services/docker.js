const LOGGER = require('utils/logging').createLogger('container');

const { PassThrough } = require("stream");
const Docker = require('dockerode');

const docker = new Docker();

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
  container.stdout = new PassThrough();
  container.stderr = new PassThrough();
  container.stdin = new PassThrough();

  const stream = await container.attach({ stream: true, hijack: true, stdout: true, stderr: true, stdin: true });
  container.modem.demuxStream(stream, container.stdout, container.stderr);
  container.stdin.pipe(stream);

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

module.exports.pull = (...args) => docker.pull(...args);
