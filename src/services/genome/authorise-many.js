const Genome = require('models/genome');
const { ServiceRequestError, NotFoundError } = require('utils/errors');

module.exports = ({ user, sessionID, ids }) => {
  if (!ids) throw new ServiceRequestError('Missing Ids');

  const $or = [ { public: true } ];

  if (user) $or.push({ _user: user._id });
  else if (sessionID) $or.push({ _session: sessionID });

  return Genome.count({ _id: { $in: ids }, $or })
    .then(count => {
      if (count !== ids.length) throw new NotFoundError('Not found or access denied');
      return true;
    });
};
