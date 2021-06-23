const fs = require('fs');
const crypto = require('crypto');
const temp = require('temp').track();
const ZipStream = require('zip-stream');
const objectStore = require('utils/object-store');

const { PassThrough, Readable } = require('stream');

const { maxGenomeFileSize = 20, maxReadsFileSize = 100 } = require('configuration');
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
    suffix
  });
}

async function store(stream, maxMb = maxGenomeFileSize) {
  const maxGenomeFileSizeBytes = maxMb * 1048576;
  tempPath = await createTempFile('.fa');

  try {
    /* eslint-disable no-async-promise-executor */
    const fileId = await new Promise(async (resolve, reject) => {
      let length = 0;
      const hash = crypto.createHash('sha1');
  
      async function* passthrough() {
        for await (const chunk of stream) {
          length += chunk.length;
          if (length > maxGenomeFileSizeBytes) throw new MaxLengthError(length, maxGenomeFileSizeBytes);
          hash.update(chunk);
          yield chunk;
        }
        resolve(hash.digest('hex'));
      }
  
      const outstream = Readable.from(passthrough());
      outstream.on('error', reject);
      outstream.pipe(fs.createWriteStream(tempPath));
    });
  
    const fastaKey = await objectStore.putFasta(fileId, fs.createReadStream(tempPath));
    return { fileId, fastaKey };
  } finally {
    await rm(tempPath);
  }
}

async function storeReads({ genomeId, stream, fileNumber, maxMb = maxGenomeFileSize }) {
  const maxGenomeFileSizeBytes = maxMb * 1048576;
  tempPath = await createTempFile('.fastq.gz');

  try {
    /* eslint-disable no-async-promise-executor */
    await new Promise(async (resolve, reject) => {
      let length = 0;

      async function* passthrough() {
        for await (const chunk of stream) {
          length += chunk.length;
          if (length > maxGenomeFileSizeBytes) throw new MaxLengthError(length, maxGenomeFileSizeBytes);
          yield chunk;
        }
        resolve();
      }

      const outstream = Readable.from(passthrough());
      outstream.on('error', reject);
      outstream.pipe(fs.createWriteStream(tempPath));
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
