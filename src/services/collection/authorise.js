const Collection = require('models/collection');
const { NotFoundError } = require('../../utils/errors');

module.exports = ({ user, id, query: userQuery, projection = {} }) => {
  console.log(userQuery);
  const authQuery = { $or: [ { link: id } ] };
  if (user) authQuery.$or.push({ _user: user._id, uuid: id });

  const query = userQuery ? { $and: [ authQuery, userQuery ] } : authQuery;
  return Collection.findOne(query, projection)
    .then(collection => {
      if (!collection) {
        throw new NotFoundError('No collection found for this user');
      }
      return collection;
    });
};
