const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ id, user, metadata, reference }) {
  if (!reference && !user) {
    throw new ServiceRequestError('Not authenticated');
  }

  return (
    Genome.updateMetadata(id, { user }, metadata)
      .then(({ nModified, country }) => {
        if (nModified === 0) throw new ServiceRequestError('No genome found with id/user combination');
        return { id, country };
      })
  );
};
