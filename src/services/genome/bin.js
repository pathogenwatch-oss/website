const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ id, user, status }) {
  if (!user || typeof status !== 'boolean') {
    return new ServiceRequestError('User or status not provided');
  }

  return (
    Genome.update({ _id: id, _user: user._id }, { binned: status })
      .then(response => {
        if (response.ok !== 1) throw new ServiceRequestError('Failed to complete bin action');
        return {};
      })
  );
};
