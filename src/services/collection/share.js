const Collection = require('models/collection');

const { ServiceRequestError, NotFoundError } = require('utils/errors');

module.exports = function ({ token, user, status }) {
  if (!user || typeof status !== 'boolean') {
    return new ServiceRequestError('User or status not provided');
  }

  return Collection
    .find({ token, _user: user._id }, { link: 1 })
    .then(collection => {
      if (!collection) return new NotFoundError('Incorrect id and user combination.');
      if (status === false) {
        return (
          Collection.update(
            { token, _user: user._id },
            { $unset: { link: 1 } }
          )
          .then(response => {
            if (response.ok !== 1) throw new ServiceRequestError('Failed to complete share action');
            return {};
          })
        );
      }

      if (collection.link) {
        return collection.link;
      }

      const link = Collection.getShareableLink();

      return (
        Collection.update(
          { token, _user: user._id },
          { link }
        )
        .then(response => {
          if (response.ok !== 1) throw new ServiceRequestError('Failed to complete share action');
          return { link };
        })
      );
    });
};
