const Genome = require('models/genome');

const { ServiceRequestError, NotFoundError } = require('utils/errors');

function getFiles(credentials, ids, projection) {
  const query = Object.assign(
    {}, Genome.getPrefilterCondition(credentials), { _id: { $in: ids } }
  );
  return (
    Genome.find(query, projection).lean()
  );
}

module.exports = ({ user, sessionID, ids, projection = {} }) => {
  if (!ids || !ids.length) throw new ServiceRequestError('Missing Ids');

  return getFiles({ user, sessionID }, ids, projection)
    .then(genomes => {
      if (genomes.length !== ids.length) {
        throw new NotFoundError();
      }
      return genomes;
    });
};
