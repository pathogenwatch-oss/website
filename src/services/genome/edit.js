const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ id, user, sessionID, metadata }) {
  if (!user && !sessionID) {
    throw new ServiceRequestError('Not authenticated');
  }

  return (
    Genome.updateMetadata(id, { user, sessionID }, metadata)
      .then(({ nModified, country }) => {
        if (nModified === 0) throw new ServiceRequestError('No genome found with id/user combination');
        return { id, country };
      })
  );
};
