const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const { PassThrough } = require('stream');

const { fastaStoragePath } = require('configuration');

function lookupPath(fileId, compressed = true) {
  const base = path.join(fastaStoragePath, fileId.slice(0, 2), fileId.slice(2));
  return compressed ? `${base}.gz` : base;
}

function exists(filepath) {
  return new Promise((resolve) => {
    fs.access(filepath, fs.constants.R_OK, (err) => {
      resolve(!err);
    });
  });
}

function fetch(fileId) {
  const outStream = new PassThrough();
  (async () => {
    const filePathCompressed = lookupPath(fileId, true);
    const compressed = await exists(filePathCompressed);
    if (compressed) {
      return fs
        .createReadStream(filePathCompressed)
        .pipe(outStream);
    }
    return fs
      .createReadStream(lookupPath(fileId, false))
      .pipe(zlib.createGzip())
      .pipe(outStream);
  })().catch((err) => {
    outStream.destroy(err);
  });
  return outStream;
}

module.exports = {
  fetch,
};
