const Collection = require('models/collection');
const { NotFoundError } = require('../../utils/errors');

const defaultAccess = { access: { $in: [ 'shared', 'public' ] } };

module.exports = ({ user, token = '', query: userQuery, projection = {} }) => {
  const authQuery = { token };
  if (user) {
    authQuery.$or = [ defaultAccess, { _user: user._id } ];
  } else {
    authQuery.access = defaultAccess.access;
  }

  const query = userQuery ? { $and: [ authQuery, userQuery ] } : authQuery;
  return Collection.findOne(query, projection)
    .then(collection => {
      if (!collection) {
        throw new NotFoundError('No collection found for this user');
      }
      return collection;
    });
};
