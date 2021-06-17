const LOGGER = require('../utils/logging').createLogger('container');

const { PassThrough } = require("stream");
const Docker = require('dockerode');
const docker = new Docker();

module.exports = async function (image, environment, timeout, resources, dockerOpts={}) {
  const { Env=[], HostConfig={}, ...otherOpts } = dockerOpts;
  
  const opts = {
    Image: image,

    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    OpenStdin: true,
    StdinOnce: true,
    AutoRemove: true,
    
    Env,
    HostConfig,
    ...otherOpts,
  }

  if (resources.memory) {
    opts.HostConfig.Memory = resources.memory;
    opts.HostConfig.MemorySwap = resources.memory;
  }

  for (const key in environment) opts.Env.push(`${key}=${environment[key]}`)

  const container = await docker.createContainer(opts);

  const stream = await container.attach({stream: true, hijack: true, stdout: true, stderr: true, stdin: true});
  container.stdout = new PassThrough();
  container.stderr = new PassThrough();
  container.modem.demuxStream(stream, container.stdout, container.stderr);
  container.stdin = stream;

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