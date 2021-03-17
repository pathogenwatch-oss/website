const store = require('utils/object-store');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = async function ({ fileId, task, version, organismId }) {
  LOGGER.info('Checking cache for', fileId, task, version, organismId);
  const value = await store.getAnalysis(task, version, fileId);
  if (value !== undefined) {
    const model = JSON.parse(value);
    if (model.organismId === organismId) {
      LOGGER.info('Found in cache, returning results.');
      return model.results;
    };
  }
  LOGGER.info('Not found in cache.');
  return null;
};
