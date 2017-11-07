const fs = require('fs');
const docker = require('docker-run');
const fastaStorage = require('wgsa-fasta-store');

const Analysis = require('models/analysis');
const TaskLog = require('models/taskLog');

const { fastaStoragePath } = require('configuration');
const { getImageName } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

function runTask(fileId, task, version, organismId, speciesId, genusId) {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();
    const container = docker(getImageName(task, version), {
      env: {
        WGSA_ORGANISM_TAXID: organismId,
        WGSA_SPECIES_TAXID: speciesId,
        WGSA_GENUS_TAXID: genusId,
        WGSA_FILE_ID: fileId,
      },
    });
    const stream = fs.createReadStream(fastaStorage.getFilePath(fastaStoragePath, fileId));
    stream.pipe(container.stdin);
    const buffer = [];
    container.stdout.on('data', (data) => {
      buffer.push(data.toString());
    });
    container.on('exit', (exitCode) => {
      LOGGER.info('exit', exitCode);
      const [ durationS, durationNs ] = process.hrtime(startTime);
      const duration = Math.round(durationS * 1000 + durationNs / 1e6);
      TaskLog.create({ fileId, task, version, organismId, speciesId, genusId, duration, exitCode });
      if (exitCode !== 0) {
        container.stderr.setEncoding('utf8');
        reject(new Error(container.stderr.read()));
      } else if (buffer.length === 0) {
        reject(new Error('No output received.'));
      } else {
        let output;
        try {
          output = JSON.parse(buffer.join(''));
        } catch (e) {
          reject(e);
        }
        resolve(output);
      }
    });
    container.on('spawn', (containerId) => {
      LOGGER.info('spawn', containerId, 'for file', fileId);
    });
    container.on('error', reject);
  });
}

module.exports = function handleMessage({ fileId, task, version, organismId, speciesId, genusId }) {
  return Analysis.findOne({ fileId, task, version })
    .then(model => {
      if (model) return model.results;
      return (
        runTask(fileId, task, version, organismId, speciesId, genusId)
          .then(results => {
            Analysis.create({ fileId, task, version, results });
            return results;
          })
      );
    });
};
