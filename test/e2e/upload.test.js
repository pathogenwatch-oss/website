var async = require('async');

var registerCollection = require('./features/register-collection');
var connectWsClient = require('./features/ws-client');
var uploadAssembly = require('./features/upload-assembly');

describe('Full Upload Test', function () {

  it('should complete a full upload', function (done) {
    this.timeout(1000 * 60 * 5);

    var assemblyFilenames = [ 'JH1.fna', 'JH9.fna', 'MW2.fna' ];

    registerCollection(assemblyFilenames)
      .end(function (err, res) {
        var collectionId = res.body.collectionId;
        var assemblyIds = res.body.userAssemblyIdToAssemblyIdMap;

        connectWsClient(function (socket, roomId) {
          async.each(assemblyFilenames, function (filename, callback) {
            uploadAssembly(request, {
              socketRoomId: roomId,
              collectionId: collectionId,
              assemblyId: assemblyIds[filename],
              fileName: filename
            }, socket, callback)
            .expect(200)
            .end(function (error) {
              if (error) callback(error);
            });
          }, done);
        });

      });
  });

});
