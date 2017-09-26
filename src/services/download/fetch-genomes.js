const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');

const { ServiceRequestError, NotFoundError } = require('utils/errors');

const getFiles = {
  genome: (credentials, ids, projection) => {
    const query = Object.assign(
      {}, Genome.getPrefilterCondition(credentials), { _id: { $in: ids } }
    );
    return (
      Genome.find(query, projection).lean()
    );
  },
  collection: (_, ids, projection) =>
    CollectionGenome.find({ _id: { $in: ids } }, projection).lean(),
};

module.exports = ({ user, sessionID, type, ids, projection = {} }) => {
  if (!(type in getFiles)) throw new ServiceRequestError('Invalid type');
  if (!ids || !ids.length) throw new ServiceRequestError('Missing Ids');

  return getFiles[type]({ user, sessionID }, ids, projection)
    .then(genomes => {
      if (genomes.length !== ids.length) {
        throw new NotFoundError();
      }
      return genomes;
    });
};
