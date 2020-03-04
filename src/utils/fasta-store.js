const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v4');
const zlib = require('zlib');
const crypto = require('crypto');
const ZipStream = require('zip-stream');

const { Transform, PassThrough } = require('stream');

const {fastaStoragePath, maxGenomeFileSize = 10} = require('configuration');
const maxGenomeFileSizeBytes = maxGenomeFileSize * 1048576;

async function setup() {
  await mkdirp(path.join(fastaStoragePath, 'tmp'));
  await mkdirp(path.join(fastaStoragePath, 'archives'));
}

function lookupPath(fileId, compressed = true) {
  const base = path.join(fastaStoragePath, fileId.slice(0, 2), fileId.slice(2));
  return compressed ? `${base}.gz` : base;
}

async function store(stream) {
  await setup();
  const tempPath = path.join(fastaStoragePath, 'tmp', uuid());
  const tempFile = fs.createWriteStream(tempPath);

  let length = 0;
  const hash = crypto.createHash('sha1');
  const hashAndCountBytes = new Transform({
    transform(chunk, _, callback) {
      length += chunk.length;
      if (length > maxGenomeFileSizeBytes) return callback(new MaxLengthError(length, maxGenomeFileSizeBytes))
      hash.update(chunk);
      return callback(null, chunk);
    },
  });

  const fileId = await new Promise((resolve, reject) => {
    stream
      .pipe(hashAndCountBytes)
      .on('error', error => {
        fs.unlink(tempPath);
        reject(error);
      })
      .pipe(zlib.createGzip())
      .pipe(tempFile)
      .on('close', () => resolve(hash.digest('hex')));
  });

  const filePath = lookupPath(fileId);
  await mkdirp(path.dirname(filePath));
  await fs.promises.rename(tempPath, filePath);
  return { fileId, filePath };
}

function fetch(fileId) {
  const outStream = new PassThrough();
  (async () => {
    const filePathCompressed = lookupPath(fileId, true);
    const compressed = await exists(filePathCompressed);
    if (compressed) {
      return fs
        .createReadStream(filePathCompressed)
        .pipe(zlib.createGunzip())
        .pipe(outStream);
    }
    return fs
      .createReadStream(lookupPath(fileId, false))
      .pipe(outStream);
  })().catch(err => {
    outStream.destroy(err);
  });
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

function mkdirp(filepath) {
  return fs.promises.mkdir(filepath, {recursive: true});
}

function exists(filepath) {
  return new Promise((resolve) => {
    fs.access(filepath, fs.constants.R_OK, (err) => {
      resolve(!err);
    });
  });
}

module.exports = {
  store,
  fetch,
  archive,
};
