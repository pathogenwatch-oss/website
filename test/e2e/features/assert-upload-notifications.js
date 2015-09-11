var EXPECTED_ASSEMBLY_RESULTS = [
  // confirmations
  'UPLOAD_OK',
  'METADATA_OK',
  // analysis results
  'FP_COMP',
  'MLST_RESULT',
  'PAARSNP_RESULT',
  'CORE_RESULT',
  'SCCMEC'
];
var EXPECTED_COLLECTION_RESULTS = [
  'PHYLO_MATRIX', 'SUBMATRIX', 'CORE_MUTANT_TREE'
];

function identity(value) {
  return value;
}

function allResultsReceived(allExpectedResults) {
  return (
    Object.keys(allExpectedResults).reduce(function (total, assemblyId) {
      return total + allExpectedResults[assemblyId].length;
    }, 0) === 0
  );
}

module.exports = function (socket, ids, done) {
  var collectionId = ids.collectionId;
  var assemblyIdMap = ids.assemblyNameToAssemblyIdMap;
  var allExpectedResults = {};

  allExpectedResults[collectionId] = EXPECTED_COLLECTION_RESULTS.map(identity);

  Object.keys(assemblyIdMap).reduce(function (all, filename) {
    all[assemblyIdMap[filename]] = EXPECTED_ASSEMBLY_RESULTS.map(identity);
    return all;
  }, allExpectedResults);

  console.log('***', allExpectedResults);

  socket.on('assemblyUploadNotification', function (message) {
    var taskType = message.taskType || message.result;
    var expectedResults = allExpectedResults[message.assemblyId || message.collectionId];
    console.log('*** Received: ' + taskType);

    if (expectedResults.indexOf(taskType) === -1) {
      console.log('Unexpected task type: ' + taskType);
      return;
    }

    expectedResults.splice(expectedResults.indexOf(taskType), 1);

    console.log('*** Remaining results: ' + expectedResults, '(' + expectedResults.length + ')');

    if (allResultsReceived(allExpectedResults)) {
      console.log('*** done!');
      return done();
    }
  });

};
