const fastaStorage = require('../../utils/fasta-store')

const { ServiceRequestError } = require('utils/errors');

module.exports = ({ genomeId, stream, fileNumber }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }
  return fastaStorage.storeReads({ genomeId, stream, fileNumber });
};
