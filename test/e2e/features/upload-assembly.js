var fs = require('fs');
var path = require('path');

var expectedResults = [
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

module.exports = function (requestData, socket, done) {
  var collectionId = requestData.collectionId;
  var assemblyId = requestData.assemblyId;
  var roomId = requestData.roomId;
  var fileName = requestData.fileName;

  socket.on('assemblyUploadNotification', function (message) {
    var taskType = message.taskType || message.result;
    console.log('Received: ' + taskType);

    if (expectedResults.indexOf(taskType) === -1) {
      console.log('Unexpected task type: ' + taskType);
      return;
    }

    expectedResults.splice(expectedResults.indexOf(taskType), 1);

    if (!expectedResults.length) {
      return done();
    }

    console.log('Remaining results: ' + expectedResults);
  });

  return request
    .post('/assembly/add')
    .send({
      collectionId: collectionId,
      socketRoomId: roomId,
      assemblyId: assemblyId,
      metadata: {},
      sequences: fs.readFileSync(path.join(__dirname, 'fixtures', fileName), { encoding: 'utf-8' })
    });
};
