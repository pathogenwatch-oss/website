var fs = require('fs');
var path = require('path');

module.exports = function (requestData) {
  var collectionId = requestData.collectionId;
  var assemblyId = requestData.assemblyId;
  var fileName = requestData.fileName;

  return request
    .post('/api/species/1280/collection/' + collectionId + '/assembly/' + assemblyId)
    .send({
      metadata: {},
      sequences: fs.readFileSync(path.resolve(__dirname, '..', 'fixtures', fileName), { encoding: 'utf-8' }),
    });
};
