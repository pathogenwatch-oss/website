const Collection = require('models/collection');

const { ServiceRequestError, NotFoundError } = require('utils/errors');

module.exports = function ({ id, user, status }) {
  if (!user || typeof status !== 'boolean') {
    return new ServiceRequestError('User or status not provided');
  }

  return Collection
    .find({ _id: id, _user: user._id }, { link: 1 })
    .then(collection => {
      if (!collection) return new NotFoundError('Incorrect id and user combination.');

      if (collection.link) {
        return collection.link;
      }

      const link = Collection.getShareableLink();

      return (
        Collection.update(
          { _id: id, _user: user._id },
          { link }
        )
        .then(response => {
          if (response.ok !== 1) throw new ServiceRequestError('Failed to complete bin action');
          return { link };
        })
      );
    });
};
