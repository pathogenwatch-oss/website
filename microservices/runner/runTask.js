const fs = require('fs');
const docker = require('docker-run');

const Analysis = require('models/analysis');
const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

const LOGGER = require('utils/logging').createLogger('runner');

function getImageName(task, version) {
  return `registry.gitlab.com/cgps/wgsa/tasks/${task}:v${version}`;
}

function runTask(fileId, task, version) {
  return new Promise((resolve, reject) => {
    const container = docker(getImageName(task, version));
    const stream = fs.createReadStream(fastaStorage.getFilePath(fastaStoragePath, fileId));
    stream.pipe(container.stdin);
    const buffer = [];
    container.stdout.on('data', (data) => {
      LOGGER.info('stdout', data.toString());
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
