const Collection = require('models/collection');

module.exports = function ({ alias }) {
  return (
    Collection.findOne({ alias }, { uuid: 1 })
      .lean()
      .then(doc => (doc ? doc.uuid : undefined))
  );
};
