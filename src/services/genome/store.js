const { ServiceRequestError } = require('utils/errors');
const fastaStorage = require('../../utils/fasta-store');

module.exports = ({ stream }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }
  return fastaStorage.store(stream);
};
