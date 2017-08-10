const pull = require('docker-pull');

const LOGGER = require('utils/logging').createLogger('runner');

const { getImages } = require('manifest.js');

const options = {
  // host: 'localhost',
  // version: 'v2',
  username: '',
  password: '',
};

function pullImage(name) {
  console.log(name);
  return new Promise((resolve, reject) => {
    const p = pull(name, options, err => (err ? reject(err) : resolve()));
    p.on('progress', () => LOGGER.info(`${name} pulled ${p.layers} new layers and ${p.transferred}/${p.length} bytes`));
  });
}

Promise.all(getImages().map(pullImage))
  .then(() => LOGGER.info('Success'))
  .catch(err => console.error(err));
