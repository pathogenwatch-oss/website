const LOGGER = require('utils/logging').createLogger('runner');

const { getImages, getImageName, getSpeciatorTask, getClusteringTask } = require('manifest.js');
const { tasks } = require('configuration.js');
const { username = 'anon', password = '' } = tasks.registry || {};

const dockerPull = require('docker-pull');
const mapLimit = require('promise-map-limit');

const { queues } = require('../taskQueue');

function getImageNames(queue) {
  const speciator = getSpeciatorTask();
  const speciatorImage = getImageName(speciator.task, speciator.version);
  const clustering = getClusteringTask();
  const clusteringImage = getImageName(clustering.task, clustering.version);

  if (queue === queues.genome) {
    return [ speciatorImage ];
  }

  if (queue === queues.collection) return getImages('collection');

  if (queue === queues.task) return getImages('genome');

  if (queue === queues.clustering) {
    return [ clusteringImage ];
  }

  return [
    speciatorImage,
    clusteringImage,
    ...getImages('genome'),
    ...getImages('collection'),
  ];
}

const options = { host: null, version: 'v2', username, password };
function pullImage(name) {
  return new Promise((resolve, reject) => {
    LOGGER.info(`Pulling image ${name}`);
    const p = dockerPull(name, options, err => (err ? reject(err) : resolve()));
    p.on('progress', () => {
      if (p._layers !== p.layers) {
        LOGGER.info(`${name} pulled %d new layers and %d/%d bytes`, p.layers, p.transferred, p.length);
      }
      p._layers = p.layers;
    });
  });
}

const LIMIT = 5;

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
