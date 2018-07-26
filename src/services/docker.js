const docker = require('docker-run');
const LOGGER = require('../utils/logging').createLogger('container');

module.exports = function (image, dockerOpts, timeout) {
  const container = docker(image, dockerOpts);
  if (timeout) {
    const t = setTimeout(() => {
      LOGGER.warn(`Container '${image}' (${container.id.slice(0, 8)}) timed out after ${timeout} milliseconds`);
      container.destroy();
    }, timeout);
    container.on('exit', () => clearTimeout(t));
  }
  return container;
};
