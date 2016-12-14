const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

module.exports = ({ fileId }) => console.log('***', fileId) || Promise.resolve(
  fastaStorage.getFilePath(fastaStoragePath, fileId)
);
