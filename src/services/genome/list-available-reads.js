const store = require('utils/object-store');

module.exports = ({ genomeId }) => {
  return store.listReads(genomeId);
};
