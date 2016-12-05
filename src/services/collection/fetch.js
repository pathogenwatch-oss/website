const Collection = require('data/collection');

module.exports = ({ uuid }) =>
  Collection.findOne({ uuid }).then(collection => collection.toObject());
