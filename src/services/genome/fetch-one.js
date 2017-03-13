const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const { ServiceRequestError } = require('utils/errors');

function hasAccess(user) {
  const conditions = [ { public: true } ];
  if (user) conditions.push({ user: user._id });
  return conditions;
}

const fetch = {
  genome: (user, id) =>
    Genome.
      findOne({ _id: id, $or: hasAccess(user) }).
      populate('_file'),
  collection: (user, id) =>
    CollectionGenome.
      findOne({ _id: id }),
};

module.exports = ({ user, type = 'genome', id }) => {
  if (!(type in fetch)) throw new ServiceRequestError('Invalid type');
  if (!id) throw new ServiceRequestError('Missing Id');

  return fetch[type](user, id).
    then(record => {
      if (!record) throw new ServiceRequestError('Not found or access denied.');
      return record;
    });
};
