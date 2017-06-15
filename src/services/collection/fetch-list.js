const Collection = require('models/collection');

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = 0, searchText } = query;
  const { organismId, owner, startDate, endDate } = query;

  const findQuery = Collection.getPrefilterCondition(props);

  if (searchText) {
    findQuery.$text = { $search: searchText };
  }

  if (organismId) {
    findQuery.organismId = organismId;
  }

  if (user) {
    if (owner === 'me') {
      findQuery._user = user;
    } else if (owner === 'other') {
      findQuery._user = { $ne: user };
    }
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
    Collection
      .find(findQuery, {
        _user: 1,
        description: 1,
        pmid: 1,
        public: 1,
        size: 1,
        organismId: 1,
        status: 1,
        title: 1,
        uuid: 1,
        createdAt: 1,
      }, {
        skip: Number(skip),
        limit: Number(limit),
        sort: { createdAt: -1 },
      })
      .then(collections => collections.map(_ => _.toObject({ user })))
  );
};
