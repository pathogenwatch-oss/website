const LOGGER = require('utils/logging').createLogger('watcher');

const handleMessage = require('./messageHandler');

module.exports = function () {
  const { fileId, task, version } = {
    fileId: '0d10beb4b2b13613357555425d58b7c58386a878',
    task: 'test',
    version: '1',
  };

  LOGGER.info(`Processing message: ${fileId} ${task} ${version}`);

  handleMessage(fileId, task, version)
    .then(results => {
      LOGGER.info('results', results);
    })
    .catch(error => {
      LOGGER.error(error);
    });
};
