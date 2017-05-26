const Collection = require('models/collection');

module.exports = function ({ alias }) {
  return (
    Collection.findOne({ alias }, { uuid: true })
      .then(doc => (doc ? doc.uuid : undefined))
  );
};
