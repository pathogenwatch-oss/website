var connectWsClient = require('./features/ws-client');
var uploadAssembly = require('./features/upload-assembly');
var assertUploadNotifications = require('./features/assert-upload-notifications');

describe('Assembly Routes', function () {

  it('POST /api/assembly', function (done) {
    var fixture = require('./fixtures/assembly.json');
    request
      .post('/api/assembly')
      .send({ assemblyId: 'a1de6463-a6b8-4810-bbe4-94d782d452c5' })
      .expect(200, fixture, done);
  });

  it('POST /api/assemblies', function (done) {
    var fixture = require('./fixtures/assemblies.json');
    var assemblyIds = [
      'a1de6463-a6b8-4810-bbe4-94d782d452c5',
      '85974b89-fb99-4035-8eb6-74770d2dc794'
    ];

    request
      .post('/api/assemblies')
      .send({ assemblyIds: assemblyIds })
      .expect(200, fixture, done);
  });

  it('POST /api/assembly/table-data', function (done) {
    var fixture = require('./fixtures/assembly-table-data.json');
    var assemblyIds = [
      'a1de6463-a6b8-4810-bbe4-94d782d452c5',
      '85974b89-fb99-4035-8eb6-74770d2dc794'
    ];

    request
      .post('/api/assembly/table-data')
      .send({ assemblyIds: assemblyIds })
      .expect(200, fixture, done);
  });

  it('POST /api/assembly/resistance-profile', function (done) {
    var fixture = require('./fixtures/resistance-profiles.json');
    var assemblyIds = [
      'a1de6463-a6b8-4810-bbe4-94d782d452c5',
      '85974b89-fb99-4035-8eb6-74770d2dc794'
    ];

    request
      .post('/api/assembly/resistance-profile')
      .send({ assemblyIds: assemblyIds })
      .expect(200, fixture, done);
  });

  it('GET /api/assembly/:id/core-result', function (done) {
    var fixture = require('./fixtures/core-result.json');
    request
      .get('/api/assembly/a1de6463-a6b8-4810-bbe4-94d782d452c5/core-result')
      .expect(200, fixture, done);
  });


  it.skip('POST /assembly/add', function (done) {
    this.timeout(1000 * 60 * 2);

    connectWsClient(function (socket, roomId) {

      assertUploadNotifications(socket, {
        'MW2.fna': 'c4abd5a8-08de-43e0-988f-3554a20facf4'
      }, done);

      uploadAssembly({
        socketRoomId: roomId,
        collectionId: 'fefec50d-b7ad-4046-8431-d1e5f28c8387',
        assemblyId: 'c4abd5a8-08de-43e0-988f-3554a20facf4',
        fileName: 'MW2.fna'
      })
      .expect(200)
      .end(function (err) {
        if (err) done(err);
      });
    });

  });

});
