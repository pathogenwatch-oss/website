const { PassThrough } = require("stream");
const archiver = require('archiver');

const { request } = require('services/bus');

const TaskLog = require('models/taskLog');
const Genome = require('models/genome');
const store = require('utils/object-store');

const notify = require('services/genome/notify');
const docker = require('services/docker');
const { DEFAULT_TIMEOUT } = require('services/bus');
const { getImageName } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

// Based on https://stackoverflow.com/a/12502559
// by https://stackoverflow.com/users/569544/jar-jar-beans
// This is not a secure random number
const random = () => Math.random().toString(36).slice(2, 10);

const slugify = (task) => task.replace(/[^a-zA-Z0-9]+/g, '_').replace(/[_]+/g, '_').replace(/_$/g, '');

function inputStream(genomeId, readsKeys) {
  const archive = archiver('tar');
  for (let i = 0; i < readsKeys.length; i++) {
    const key = readsKeys[i];
    const outStream = new PassThrough();
    outStream.on('error', (err) => archive.emit(err));
    store.get(key, { outStream, decompress: false });
    archive.append(outStream, { name: `${genomeId}_${i + 1}.fastq.gz` });
  }
  archive.finalize();
  return archive;
}

async function runTask({ spec, metadata }) {
  const { task, version, resources, timeout } = spec;
  const { userId: user, genomeId: id, clientId, readsKeys } = metadata;
  const name = `${slugify(task)}_${random()}`;
  const container = await docker(
    getImageName(task, version),
    {},
    timeout,
    resources,
    {
      name,
    }
  );

  const whenOutput = request('genome', 'upload', {
    timeout$: (timeout + 60) * 1000,
    stream: container.stdout,
    id,
    user,
    clientId,
  });
  whenOutput.catch((err) => LOGGER.error(err));

  const startTime = process.hrtime();
  await container.start();
  LOGGER.info('spawn', container.id, 'for task', task);

  try {
    const stream = inputStream(id, readsKeys);
    stream.on('error', (err) => {
      LOGGER.info('Error in input stream, destroying container.');
      container.kill();
    });
    stream.pipe(container.stdin);
  } catch (err) {
    await container.kill();
    throw err;
  }

  const { StatusCode: statusCode } = await container.wait();
  LOGGER.info('exit', statusCode);

  const [ durationS, durationNs ] = process.hrtime(startTime);
  const duration = Math.round(durationS * 1000 + durationNs / 1e6);

  const { fileId } = await whenOutput;
  TaskLog.create({ fileId, task, version, duration, statusCode, resources });

  if (statusCode !== 0) {
    container.stderr.setEncoding('utf8');
    throw new Error(container.stderr.read());
  } else {
    return fileId;
  }
}

module.exports = async function ({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  const { task, version } = spec;
  const {
    genomeId,
    uploadedAt,
    clientId,
    userId,
  } = metadata;

  const value = await Genome.findOne({ _id: genomeId }, { fileId: 1 }).lean();

  if (value && value.fileId) {
    // The genome already has an assembly
    const { fileId } = value;
    return notify({
      genomeId,
      clientId,
      userId,
      uploadedAt,
      tasks: [ { fileId, task, version } ],
    });
  }

  const fileId = await runTask({ spec, metadata });
  LOGGER.info(`Build reads for ${genomeId} into ${fileId}`);
  return fileId;
};
