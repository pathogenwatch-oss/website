var async = require('async');

var registerCollection = require('./features/register-collection');
var connectWsClient = require('./features/ws-client');
var assertUploadNotifications = require('./features/assert-upload-notifications');
var uploadAssembly = require('./features/upload-assembly');

describe('Full Upload Test', function () {

  it.only('should complete a full upload', function (done) {
    this.timeout(1000 * 60 * 5);

    var assemblyFilenames = [ 'JH1.fna', 'JH9.fna', 'MW2.fna' ];

    connectWsClient(function (socket, roomId) {
      registerCollection(assemblyFilenames, roomId).end(function (err, res) {
        var collectionId = res.body.collectionId;
        var assemblyIds = res.body.userAssemblyIdToAssemblyIdMap;

        assertUploadNotifications(socket, res.body, done);

        async.each(assemblyFilenames, function (filename, callback) {
          uploadAssembly({
            socketRoomId: roomId,
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

});
