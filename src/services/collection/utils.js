const constants = require('./constants');
const { EXPECTED_COLLECTION_RESULTS, EXPECTED_ASSEMBLY_RESULTS } = constants;

exports.calculateExpectedResults = function (collectionSize) {
  return (
    collectionSize * EXPECTED_ASSEMBLY_RESULTS.size +
    EXPECTED_COLLECTION_RESULTS.size
  );
};
