const LOGGER = require('utils/logging').createLogger('watcher');

const Analysis = require('models/analysis');

const docker = require('docker-run');

function getImageName(task, version) {
  return `wgsa-task-${task}:${version}`;
}

function runTask(fileId, task, version) {
  return new Promise((resolve, reject) => {
    const container = docker(getImageName(task, version));
    const buffer = [];
    container.stdout.on('data', (data) => {
      LOGGER.info('stdout', data);
      buffer.push(data.toString());
    });
    container.on('exit', (exitCode) => {
      LOGGER.info('exit', exitCode);
      resolve(JSON.parse(buffer.join('')));
    });
    container.on('spawn', (containerId) => {
      LOGGER.info('spawn', containerId);
    });
    container.on('error', reject);
  });
}

module.exports = function handleMessage(fileId, task, version) {
  return Analysis.findOne({ fileId, task, version })
    .then(model => {
      if (model) return model.results;
      return (
        runTask(fileId, task, version)
          .then(results => {
            Analysis.create({ fileId, task, version, results });
            return results;
          })
      );
    });
};
