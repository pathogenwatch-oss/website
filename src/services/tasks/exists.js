const Analysis = require('models/analysis');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = function ({ fileId, task, version }) {
  LOGGER.info('Checking cache for', fileId, task, version);
  return Analysis.count({ fileId, task, version })
    .then(count => count > 0);
};
