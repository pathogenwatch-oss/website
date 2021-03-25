const fs = require('fs');
const fastaStorage = require('../../utils/fasta-store');

const TaskLog = require('models/taskLog');
const Genome = require('models/genome');
const store = require('utils/object-store');

const notify = require('services/genome/notify');
const docker = require('../docker');
const { DEFAULT_TIMEOUT } = require('../bus');
const { getImageName } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

function runTask({ fileId, task, version, organismId, speciesId, genusId, timeout }) {
  if (process.env.KEEP_TASK_CONTAINERS === 'true') {
    LOGGER.warn(`Creating a container which will not be removed on completion`);
  }
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();
    const container = docker(
      getImageName(task, version),
      {
        remove: process.env.KEEP_TASK_CONTAINERS === 'true' ? false : true,
        env: {
          PW_ORGANISM_TAXID: organismId,
          PW_SPECIES_TAXID: speciesId,
          PW_GENUS_TAXID: genusId,
          PW_FILE_ID: fileId,
          // TODO: remove old API
          WGSA_ORGANISM_TAXID: organismId,
          WGSA_SPECIES_TAXID: speciesId,
          WGSA_GENUS_TAXID: genusId,
          WGSA_FILE_ID: fileId,
        },
      },
      timeout
    );
    try {
      const stream = fastaStorage.fetch(fileId);
      stream.on('error', err => {
        LOGGER.info('Error in input stream, destroying container.');
        container.destroy(() => reject(err));
      });
      stream.pipe(container.stdin);
    } catch (err) {
      LOGGER.info('Error at input stage, destroying container.');
      return container.destroy(() => reject(err));
    }
    const buffer = [];
    container.stdout.on('data', data => {
      buffer.push(data.toString());
    });
    container.on('exit', exitCode => {
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
    container.on('spawn', containerId => {
      LOGGER.info('spawn', containerId, 'for task', task, 'file', fileId, 'organismId', organismId);
    });
    container.on('error', reject);
  });
}

module.exports = async function ({ task, version, metadata, timeout$: timeout = DEFAULT_TIMEOUT, precache = false }) {
  const {
    organismId,
    speciesId,
    genusId,
    fileId,
    genomeId,
    uploadedAt,
    clientId,
    userId,
  } = metadata;
  
  const value = await store.getAnalysis(task, version, fileId, organismId);
  let doc = value === undefined ? undefined : JSON.parse(value);
  doc = (doc && doc.organismId === organismId) ? doc : undefined;
  
  if (!doc) {
    // The results weren't in the cache
    const results = await runTask({
      fileId,
      task,
      version,
      organismId,
      speciesId,
      genusId,
      timeout,
    });

    doc = { fileId, task, version, organismId, results };
    await store.putAnalysis(task, version, fileId, organismId, doc);
  }

  if (!precache) {
    await Genome.addAnalysisResults(genomeId, doc);
    notify({
      speciator: { organismId, speciesId, genusId },
      genomeId,
      clientId,
      userId,
      uploadedAt,
      tasks: [ doc ],
    });
  }
};
