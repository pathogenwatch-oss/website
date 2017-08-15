const LOGGER = require('utils/logging').createLogger('runner');

const { getImages, getImageName, getSpecieatorTask } = require('manifest.js');
const { tasks } = require('configuration.js');
const { username = 'anon', password = '' } = tasks.registry || {};

const dockerPull = require('docker-pull');

const mapLimit = require('promise-map-limit');

const LIMIT = 5;

const specieatorQueue = 'specieator';

function getImageNames(queue) {
  if (queue === specieatorQueue) {
    const { task, version } = getSpecieatorTask();
    return [ getImageName(task, version) ];
  }

  return getImages();
}

const options = { host: null, version: 'v2', username, password };
function pullImage(name) {
  return new Promise((resolve, reject) => {
    LOGGER.info(`Pulling image ${name}`);
    const p = dockerPull(name, options, err => (err ? reject(err) : resolve()));
    p.on('progress', () => LOGGER.info(`${name} pulled %d new layers and %d/%d bytes`, p.layers, p.transferred, p.length));
  });
}

function pullImages(imageNames) {
  return mapLimit(imageNames, LIMIT, pullImage);
}

module.exports = function ({ queue }) {
  return (
    Promise.resolve(queue)
      .then(getImageNames)
      .then(pullImages)
      .then(() => LOGGER.info('All images have been pulled'))
  );
};
