var async = require('async');

var registerCollection = require('./features/register-collection');
var uploadAssembly = require('./features/upload-assembly');

describe('Full Upload Test', function () {

  it('should complete a full upload', function (done) {
    this.timeout(1000 * 60 * 5);

    var assemblyNames = [ 'JH1.fna', 'JH9.fna', 'MW2.fna' ];

    registerCollection(assemblyNames).end(function (err, res) {
      var collectionId = res.body.collectionId;
      var assemblyIds = res.body.assemblyNameToAssemblyIdMap;

      async.each(assemblyNames, function (filename, callback) {
        uploadAssembly({
          collectionId: collectionId,
          assemblyId: assemblyIds[filename],
          fileName: filename
        })
        .expect(200)
        .end(callback);
      });
    });
  });

});
