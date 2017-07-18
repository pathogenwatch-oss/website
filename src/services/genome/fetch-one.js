const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const { ServiceRequestError, NotFoundError } = require('utils/errors');

const fetch = {
  genome: (credentials, id) => {
    const query = Object.assign(
      {}, Genome.getPrefilterCondition(credentials), { _id: id }
    );
    return Genome.findOne(query);
  },
  collection: (_, id) =>
    CollectionGenome.
      findOne({ _id: id }),
};

module.exports = ({ user, sessionID, type = 'genome', id }) => {
  if (!(type in fetch)) throw new ServiceRequestError('Invalid type');
  if (!id) throw new ServiceRequestError('Missing Id');

  return fetch[type]({ user, sessionID }, id).
    then(record => {
      if (!record) throw new NotFoundError('Not found or access denied.');
      return record;
    });
};
