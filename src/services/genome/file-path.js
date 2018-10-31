const fastaStorage = require('pathogenwatch-fasta-store');
const { fastaStoragePath } = require('configuration');

module.exports = ({ fileId }) => Promise.resolve(
  fastaStorage.getFilePath(fastaStoragePath, fileId)
);
