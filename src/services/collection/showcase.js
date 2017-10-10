const Collection = require('models/collection');

module.exports = function () {
  return (
    Collection.find(
      { public: true, showcase: true, binned: false, locations: { $exists: true } },
      { uuid: 1, title: 1, size: 1, organismId: 1, locations: 1, _id: 0 }
    )
  );
};
