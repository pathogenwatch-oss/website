const LOGGER = require('utils/logging').createLogger('runner');

const { getImages, getImageName, getSpeciatorTask, getClusteringTask } = require('manifest.js');
const { tasks } = require('configuration.js');

const { username = 'anon', password = '' } = tasks.registry || {};

const dockerPull = require('docker-pull');
const mapLimit = require('promise-map-limit');

const { taskTypes } = require('models/queue');

function getImageNames(taskType) {
  const speciator = getSpeciatorTask();
  const speciatorImage = getImageName(speciator.task, speciator.version);
  const clustering = getClusteringTask();
  const clusteringImage = getImageName(clustering.task, clustering.version);

  if (taskType === taskTypes.genome) {
    return [ speciatorImage ];
  }

  if (taskType === taskTypes.collection) return getImages('collection');

  if (taskType === taskTypes.task) return getImages('genome');

  if (taskType === taskTypes.clustering) {
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
    const p = dockerPull(name, options, (err) => (err ? reject(err) : resolve()));
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

module.exports = function ({ taskType }) {
  return (
    Promise.resolve(taskType)
      .then(getImageNames)
      .then(pullImages)
      .then(() => LOGGER.info('All images have been pulled'))
  );
};
