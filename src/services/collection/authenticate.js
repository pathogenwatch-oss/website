const Collection = require('models/collection');
const { NotFoundError } = require('../../utils/errors');

module.exports = ({ user, uuid, projection = {} }) =>
  Collection.findByUuid(uuid, projection)
    .then(collection => {
      if (!collection.private) {
        return collection;
      }

      if (user && collection._user && collection._user.equals(user._id)) {
        return collection;
      }

      throw new NotFoundError('No collection found for this user');
    });
