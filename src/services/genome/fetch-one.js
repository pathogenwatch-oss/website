const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const { ServiceRequestError, NotFoundError } = require('utils/errors');

const fetch = {
  genome: ({ user, sessionID }, _id) => {
    const $or = [ { public: true } ];

    if (user) $or.push({ _user: user._id });
    else if (sessionID) $or.push({ _session: sessionID });

    return Genome.findOne({ _id, $or });
  },
  collection: (_, id) =>
    CollectionGenome
      .findOne({ _id: id }),
};

module.exports = ({ user, sessionID, type = 'genome', id }) => {
  if (!(type in fetch)) throw new ServiceRequestError('Invalid type');
  if (!id) throw new ServiceRequestError('Missing Id');

  return fetch[type]({ user, sessionID }, id)
    .then(record => {
      if (!record) throw new NotFoundError('Not found or access denied');
      return record.toObject({ user });
    });
};
