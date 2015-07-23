var fs = require('fs');
var path = require('path');

module.exports = function (requestData) {
  var collectionId = requestData.collectionId;
  var assemblyId = requestData.assemblyId;
  var roomId = requestData.socketRoomId;
  var fileName = requestData.fileName;

  return request
    .post('/api/v1/assembly')
    .send({
      collectionId: collectionId,
      socketRoomId: roomId,
      assemblyId: assemblyId,
      fileAssemblyId: fileName,
      metadata: {},
      sequences: fs.readFileSync(path.resolve(__dirname, '..', 'fixtures', fileName), { encoding: 'utf-8' })
    });
};
