const Genome = require('data/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ id, user, metadata }) {
  return (
    Genome.updateMetadata(id, user, metadata)
      .then(({ nModified, country }) => {
        if (nModified === 0) throw new ServiceRequestError('No genome found with id/user combination');
        return { id, country };
      })
  );
};
