const Collection = require('models/collection');

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = 0, sort } = query;

  const findQuery = Collection.getFilterQuery(props);

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
        binned: 1,
      }, {
        skip: Number(skip),
        limit: Number(limit),
        sort: Collection.getSort(sort),
      })
      .then(collections => collections.map(_ => _.toObject({ user })))
  );
};
