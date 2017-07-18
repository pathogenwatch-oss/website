const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

module.exports = fileId => Promise.resolve(
  fastaStorage.getFilePath(fastaStoragePath, fileId)
);
