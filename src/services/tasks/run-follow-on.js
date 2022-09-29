const { Writable, Readable } = require("stream");

const store = require('utils/object-store');

const TaskLog = require('models/taskLog');
const Genome = require('models/genome');

const notify = require('services/genome/notify');
const docker = require('services/docker');
const { getImageName } = require('manifest.js');
const { addTaskDefaults } = require('manifest');
const Queue = require('models/queue');

const LOGGER = require('utils/logging').createLogger('runner');
// Based on https://stackoverflow.com/a/12502559
// by https://stackoverflow.com/users/569544/jar-jar-beans
// This is not a secure random number
const random = () => Math.random().toString(36).slice(2, 10);

const slugify = (task) => task.replace(/[^a-zA-Z0-9]+/g, '_').replace(/[_]+/g, '_').replace(/_$/g, '');

function createInputStream(inputAnalysis) {
  async function* gen() {
    const doc = JSON.parse(inputAnalysis.toString());
    const string = JSON.stringify(doc.results);
    yield string;
  }

  return Readable.from(gen());
}

async function runTask(
  {
    fileId,
    task,
    version,
    inputTask,
    inputTaskVersion,
    resources,
    organismId,
    speciesId,
    genusId,
    timeout,
  }) {
  const container = await docker(
    getImageName(task, version),
    {
      PW_ORGANISM_TAXID: organismId,
      PW_SPECIES_TAXID: speciesId,
      PW_GENUS_TAXID: genusId,
    },
    timeout,
    resources,
    {
      name: `${slugify(task)}_${random()}`,
    }
  );

  const buffer = [];
  const bufferOutput = new Writable({
    write(chunk, _, next) {
      buffer.push(chunk);
      next();
    },
  });
  container.stdout.pipe(bufferOutput);

  const startTime = process.hrtime();
  await container.start();
  LOGGER.info('spawn', container.id, 'for task', task, 'file', fileId, 'organismId', organismId);

  // Fetch the analysis result for the container input
  const inputAnalysis = await store.getAnalysis(inputTask, inputTaskVersion, fileId, organismId);
  try {
    const stream = createInputStream(inputAnalysis);
    stream.on('error', (err) => {
      LOGGER.info(`Error in input stream, destroying container. ${err.message}`);
      container.kill();
    });
    stream.pipe(container.stdin);
  } catch (err) {
    LOGGER.info('Error at input stage, destroying container.');
    return container.kill();
  }

  const { StatusCode: statusCode } = await container.wait({ condition: 'next-exit' });
  LOGGER.info('exit', statusCode);

  const [ durationS, durationNs ] = process.hrtime(startTime);
  const duration = Math.round(durationS * 1000 + durationNs / 1e6);
  TaskLog.create({ fileId, task, version, organismId, speciesId, genusId, duration, statusCode, resources });

  if (container.timeout) {
    throw new Error('timeout');
  } else if (statusCode === 137) {
    throw new Error('killed');
  } else if (statusCode !== 0) {
    container.stderr.setEncoding('utf8');
    throw new Error(container.stderr.read());
  } else if (buffer.length === 0) {
    throw new Error('No output received.');
  } else {
    return JSON.parse(buffer.join(''));
  }
}

module.exports = async function ({ spec, metadata, precache = false, priority }) {
  const { task, version, resources, timeout, inputTask, inputTaskVersion, andThen = [] } = spec;
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
      inputTask,
      inputTaskVersion,
      organismId,
      speciesId,
      genusId,
      timeout,
      resources,
    });

    doc = { fileId, task, version, organismId, results };
    await store.putAnalysis(task, version, fileId, organismId, doc);
  }

  for (const nextTask of andThen) {
    const newSpec = addTaskDefaults({
      inputTask: task,
      inputTaskVersion: version,
      ...nextTask,
    });
    await Queue.enqueue({
      spec: newSpec,
      metadata,
      precache,
      overridePriority: priority,
    });
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
