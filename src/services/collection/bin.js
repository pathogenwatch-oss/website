const Collection = require('models/collection');

const { ServiceRequestError, NotFoundError } = require('utils/errors');

module.exports = function ({ id, user, status }) {
  if (!user || typeof status !== 'boolean') {
    return new ServiceRequestError('User or status not provided');
  }

  return Collection
    .find({ _id: id, _user: user._id })
    .then(collection => {
      if (!collection) return new NotFoundError('Incorrect id and user combination.');

      if (status === collection.binned) {
        return {};
      }

      return (
        Collection.update(
          { _id: id, _user: user._id },
          { binned: status, binnedDate: status ? new Date() : null }
        )
        .then(response => {
          if (response.ok !== 1) throw new ServiceRequestError('Failed to complete bin action');
          return {};
        })
      );
    });
};
