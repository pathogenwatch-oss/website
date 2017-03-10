const Collection = require('models/collection');

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = 0, searchText } = query;
  const { speciesId, owner, startDate, endDate } = query;

  const findQuery = Collection.getPrefilterCondition(props);

  if (searchText) {
    findQuery.$text = { $search: searchText };
  }

  if (speciesId) {
    findQuery.speciesId = speciesId;
  }

  if (owner === 'me') {
    findQuery._user = user;
  } else if (owner === 'other') {
    findQuery._user = { $ne: user };
  }

  if (startDate) {
    findQuery.createdAt = { $gte: new Date(startDate) };
  }

  if (endDate) {
    findQuery.createdAt = Object.assign(
      findQuery.createdAt || {},
      { $lte: new Date(endDate) }
    );
  }

  return (
    Collection.
      find(
        findQuery,
        { _user: 1,
          description: 1,
          pmid: 1,
          public: 1,
          size: 1,
          speciesId: 1,
          status: 1,
          title: 1,
          uuid: 1,
        },
        { skip: Number(skip), limit: Number(limit) }
      ).
      then(collections => collections.map(doc => {
        const collection = doc.toObject();
        const { _user } = collection;
        const { id } = user || {};
        collection.owner = _user && _user.toString() === id ? 'me' : 'other';
        collection.id = doc._id.toString();
        collection.slug = doc.slug;
        delete collection._user;
        delete collection.uuid;
        return collection;
      }))
  );
};
