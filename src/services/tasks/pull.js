const pull = require('docker-pull');

const LOGGER = require('utils/logging').createLogger('runner');

const { getImages } = require('manifest.js');

function pullImage(name) {
  return new Promise((resolve, reject) => {
    const p = pull(name, err => (err ? reject(err) : resolve()));
    p.on('progress', () => LOGGER.info(`${name} pulled %d new layers and %d/%d bytes`, p.layers, p.transferred, p.length));
  });
}

module.exports = function handleMessage() {
  return Promise.all(getImages().map(pullImage));
};
