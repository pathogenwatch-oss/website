var EXPECTED_RESULTS = [
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

function allResultsReceived(allExpectedResults) {
  return (
    Object.keys(allExpectedResults).reduce(function (total, assemblyId) {
      return total + allExpectedResults[assemblyId].length;
    }, 0) === 0
  );
}

module.exports = function (socket, assemblyIds, done) {

  var allExpectedResults =
    Object.keys(assemblyIds).reduce(function (all, filename) {
      all[assemblyIds[filename]] = EXPECTED_RESULTS.map(function (taskType) { return taskType; });
      return all;
    }, {});

  console.log('***', allExpectedResults);

  socket.on('assemblyUploadNotification', function (message) {
    var taskType = message.taskType || message.result;
    var expectedResults = allExpectedResults[message.assemblyId];
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

  return allExpectedResults;

};
