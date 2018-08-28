const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ ids, user, status }) {
  if (!user || typeof status !== 'boolean') {
    return new ServiceRequestError('User or status not provided');
  }

  if (!Array.isArray(ids) || !ids.length) {
    return new ServiceRequestError('Invalid ids');
  }

  return Genome.update(
    { _id: { $in: ids }, _user: user._id },
    { binned: status, binnedDate: status ? new Date() : null },
    { multi: true }
  )
  .then(response => {
    if (response.ok !== 1) throw new ServiceRequestError('Failed to complete bin action');
    return { binned: response.nModified };
  });
};
