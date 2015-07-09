var fs = require('fs');
var path = require('path');

var wsClient = require('socket.io-client');

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

  it.only('POST /assembly/add', function (done) {
    var socket = wsClient('http://localhost:3000');

    socket.on('connect', function () {
      socket.emit('getRoomId');
    });

    socket.on('roomId', function (roomId) {
      var fileName = 'JH1.fna';
      request
        .post('/assembly/add')
        .send({
          collectionId: 'b8d3aab1-625f-49aa-9857-a5e97f5d6be5',
          socketRoomId: roomId,
          userAssemblyId: fileName,
          assemblyId: 'a1de6463-a6b8-4810-bbe4-94d782d452c5',
          metadata: {},
          sequences: [
            fs.readFileSync(path.join(__dirname, 'fixtures', fileName), { encoding: 'utf-8' })
          ]
        })
        .expect(200)
        .end(function (err) {
          if (err) throw err;
        });
    });

    socket.on('assemblyUploadNotification', function (message) {
      console.log(message);
      // if (message.result === 'METADATA_OK') {
      //   done();
      // }
    });

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

});
