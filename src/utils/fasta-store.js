const fs = require('fs');
const crypto = require('crypto');
const temp = require('temp').track();
const ZipStream = require('zip-stream');
const objectStore = require('utils/object-store');

const { PassThrough, Readable } = require('stream');

const { maxGenomeFileSize = 10} = require('configuration');
const { promisify } = require('util');
const maxGenomeFileSizeBytes = maxGenomeFileSize * 1048576;

const mkdir = promisify(temp.mkdir)
async function rm(p) {
  try {
    return await fs.promises.unlink(p)
  } catch (err) {
    // pass
  }
}

let fastaDir = undefined;
async function setupFastaDir() {
  if (fastaDir === undefined) fastaDir = await mkdir({ prefix: 'pw-fasta' });
  return fastaDir;
}

async function store(stream) {
  await setupFastaDir();
  const tempPath = temp.path({ dir: fastaDir, suffix: '.fa' });
  
  const fileId = await new Promise(async (resolve, reject) => {
    let length = 0;
    const hash = crypto.createHash('sha1');

    async function* passthrough() {
      for await (const chunk of stream) {
        length += chunk.length;
        if (length > maxGenomeFileSizeBytes) throw new MaxLengthError(length, maxGenomeFileSizeBytes)
        hash.update(chunk);
        yield chunk;
      }
      resolve(hash.digest('hex'))
    }

    try {
      Readable.from(passthrough()).pipe(fs.createWriteStream(tempPath));
    } catch (error) {
      reject(error)
    }
  })

  const fastaKey = await objectStore.putFasta(fileId, fs.createReadStream(tempPath));
  await rm(tempPath);
  return { fileId, fastaKey };
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
      archiveCreator.entry(stream, {name}, (err, _) => {
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
  })().catch(err => {
    archiveCreator.destroy(err);
  });
  return archiveCreator;
}

class MaxLengthError extends Error {
  constructor(length, maxLength) {
    super(`Stream length of ${length} is greater than ${maxLength}`);
  }
}

module.exports = {
  store,
  fetch,
  archive,
};
