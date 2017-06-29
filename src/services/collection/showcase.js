const Collection = require('models/collection');

module.exports = function () {
  const query = { public: true, centroid: { $exists: true }, binned: false };

  return (
    Collection
      .find(query, {
        description: 1,
        pmid: 1,
        size: 1,
        organismId: 1,
        title: 1,
        uuid: 1,
        centroid: 1,
      })
      .then(collections => collections.map(_ => _.toObject()))
  );
};
