const Analysis = require('models/analysis');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = function ({ fileId, task, version, organismId }) {
  LOGGER.info('Checking cache for', fileId, task, version, organismId);
  return Analysis.findOne({ fileId, task, version, organismId })
    .then(model => {
      if (model) {
        LOGGER.info('Found in cache, returning results.');
        return model.results;
      }
      LOGGER.info('Not found in cache.');
      return null;
    });
};
