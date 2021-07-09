const fs = require('fs');
const crypto = require('crypto');
const temp = require('temp').track();
const ZipStream = require('zip-stream');
const objectStore = require('utils/object-store');

const { PassThrough, Transform } = require('stream');

const { maxGenomeFileSize = 20, maxReadsFileSize = 500 } = require('configuration');
const { promisify } = require('util');

class MaxLengthError extends Error {
  constructor(length, maxLength) {
    super(`Stream length of ${length} is greater than ${maxLength}`);
  }
}

const mkdir = promisify(temp.mkdir);
async function rm(p) {
  try {
    return await fs.promises.unlink(p);
  } catch (err) {
    return undefined;
  }
}

let tmpUploadDir;
async function setupTmpDir() {
  if (tmpUploadDir === undefined) tmpUploadDir = await mkdir({ prefix: 'pw-tmp' });
  return tmpUploadDir;
}

async function createTempFile(suffix) {
  await setupTmpDir();
  const d = new Date();
  return temp.path({
    dir: tmpUploadDir,
    prefix: `${d.getFullYear()}${d.getUTCMonth()}${d.getUTCDay()}.`,
    suffix,
  });
}

class Hasher extends Transform {
  constructor(maxLength) {
    super();
    this.maxLength = maxLength;
    this.hash = crypto.createHash('sha1');
    this.length = 0;
    this.results = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  _transform(chunk, _, done) {
    this.length += chunk.length;
    if (this.length > this.maxLength) {
      const error = new MaxLengthError(this.length, this.maxLength);
      this.reject(error);
      done(error);
    }
    this.hash.update(chunk);
    this.push(chunk);
    return done();
  }

  _final(cb) {
    this.resolve(this.hash.digest('hex'));
    cb();
  }
}

async function store(stream, maxMb = maxGenomeFileSize) {
  const maxGenomeFileSizeBytes = maxMb * 1048576;
  const tempPath = await createTempFile('.fa');

  try {
    /* eslint-disable no-async-promise-executor */
    const fileId = await new Promise((resolve, reject) => {
      const hasher = new Hasher(maxGenomeFileSizeBytes);
      hasher.results.then(resolve).catch(reject);
      stream.on('error', reject);
      hasher.pipe(fs.createWriteStream(tempPath));
      stream.pipe(hasher);
    });

    const fastaKey = await objectStore.putFasta(fileId, fs.createReadStream(tempPath));
    return { fileId, fastaKey };
  } finally {
    await rm(tempPath);
  }
}

class LengthCheck extends Transform {
  constructor(maxLength) {
    super();
    this.maxLength = maxLength;
    this.length = 0;
    this.results = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  _transform(chunk, _, done) {
    this.length += chunk.length;
    if (this.length > this.maxLength) {
      const error = new MaxLengthError(this.length, this.maxLength);
      this.reject(error);
      done(error);
    }
    this.push(chunk);
    return done();
  }

  _final(cb) {
    this.resolve();
    cb();
  }
}

async function storeReads({ genomeId, stream, fileNumber, maxMb = maxReadsFileSize }) {
  const maxGenomeFileSizeBytes = maxMb * 1048576;
  const tempPath = await createTempFile('.fastq.gz');

  try {
    /* eslint-disable no-async-promise-executor */
    await new Promise((resolve, reject) => {
      const handler = new LengthCheck(maxGenomeFileSizeBytes);
      handler.results.then(resolve).catch(reject);
      stream.on('error', reject);
      handler.pipe(fs.createWriteStream(tempPath));
      stream.pipe(handler);
    });

    const fastaKey = await objectStore.putReads(genomeId, fileNumber, fs.createReadStream(tempPath));
    return { fastaKey };
  } finally {
    await rm(tempPath);
  }
}

function fetch(fileId) {
  const outStream = new PassThrough();
  objectStore.getFasta(fileId, { outStream });
  return outStream;
}

function archive(files) {
  const archiveCreator = new ZipStream();

  function add(stream, name) {
    return new Promise((resolve, reject) => {
      archiveCreator.entry(stream, { name }, (err, _) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  (async () => {
    for (const { name, fileId } of files) {
      const stream = fetch(fileId);
      await add(stream, name);
    }
    archiveCreator.finish();
  })().catch((err) => {
    archiveCreator.destroy(err);
  });
  return archiveCreator;
}

module.exports = {
  store,
  storeReads,
  fetch,
  archive,
};
