const Analysis = require('models/analysis');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = function ({ fileId, task, version }) {
  LOGGER.info('Checking cache for', fileId, task, version);
  return Analysis.findOne({ fileId, task, version })
    .then(model => {
      if (model) {
        LOGGER.info('Found in cache, returning results.');
        return model.results;
      }
      LOGGER.info('Not found in cache.');
      return null;
    });
};
