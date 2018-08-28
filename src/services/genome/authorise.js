const Genome = require('models/genome');
const { ServiceRequestError, NotFoundError } = require('utils/errors');

module.exports = ({ user, id, projection = {} }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  const $or = [ { public: true } ];

  if (user) {
    $or.push({ _user: user._id });
  }

  return Genome.findOne({ _id: id, $or }, projection)
    .then(record => {
      if (!record) throw new NotFoundError('Not found or access denied');
      return record.toObject({ user });
    });
};
