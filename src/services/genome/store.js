const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath, maxGenomeFileSize = 10 } = require('configuration');
fastaStorage.setup(fastaStoragePath);

const { ServiceRequestError } = require('utils/errors');

module.exports = ({ stream }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }
  return fastaStorage.store(fastaStoragePath, stream, maxGenomeFileSize * 1048576);
};
