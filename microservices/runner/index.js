const LOGGER = require('utils/logging').createLogger('runner');

const Genome = require('models/genome');

const handleMessage = require('./messageHandler');
const queue = require('./queue');

function onMessage({ genomeId, fileId, task, version }) {
  handleMessage(fileId, task, version)
    .then(results => {
      LOGGER.info('results', results);
      Genome.addAnalysisResult(genomeId, task, results);
    })
    .catch(error => {
      LOGGER.error(error);
    });
}

module.exports = function () {
  queue.dequeue(onMessage);
};
