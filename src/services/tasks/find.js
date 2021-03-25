const store = require('utils/object-store');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = async function ({ fileId, task, version, organismId }) {
  LOGGER.info('Checking cache for', fileId, task, version, organismId);
  const value = await store.getAnalysis(task, version, fileId, organismId);
  if (value !== undefined) {
    LOGGER.info('Found in cache, returning results.');
    return JSON.parse(value).results;
  }
  LOGGER.info('Not found in cache.');
  return null;
};
