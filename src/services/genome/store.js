const fastaStorage = require('../../utils/fasta-store')

const { ServiceRequestError } = require('utils/errors');

module.exports = ({ stream }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }
  return fastaStorage.store(stream);
};
