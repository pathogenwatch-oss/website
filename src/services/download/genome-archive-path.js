const sanitise = require('sanitize-filename');
const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

module.exports = ({ id }) => Promise.resolve(
  fastaStorage.getArchivePath(fastaStoragePath, sanitise(id))
);
