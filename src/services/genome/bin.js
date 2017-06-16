const Genome = require('models/genome');

const { ServiceRequestError, NotFoundError } = require('utils/errors');

module.exports = function ({ id, user, status }) {
  if (!user || typeof status !== 'boolean') {
    return new ServiceRequestError('User or status not provided');
  }

  return Genome
    .find({ _id: id, _user: user._id })
    .then(genome => {
      if (!genome) return new NotFoundError('Incorrect id and user combination.');

      if (status === genome.binned) {
        return {};
      }

      return (
        Genome.update(
          { _id: id, _user: user._id },
          { binned: status, binnedDate: status ? new Date() : null }
        )
        .then(response => {
          if (response.ok !== 1) throw new ServiceRequestError('Failed to complete bin action');
          return {};
        })
      );
    });
};
