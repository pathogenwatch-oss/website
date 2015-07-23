var assert = require('assert');
var uuid = require('node-uuid');

var registerCollection = require('./features/register-collection');

describe('Collection Routes', function () {

  it.only('GET /api/v1/collection/:id', function (done) {
    var fixture = require('./fixtures/collection.json');
    request
      .get('/api/v1/collection/e20ff5ce-bda0-40db-a5a5-641a8c65ea68')
      .expect(200, fixture, function (error, res) {
        if (error) { error.showDiff = false; }
        console.log(JSON.stringify(error.actual, null, ' '));
        done(error, res);
      });
  });

  it('GET /api/v1/collection/:id [Error]', function (done) {
    request
      .get('/api/v1/collection/' + uuid.v4())
      .expect(404, done);
  });

  it.skip('GET /api/v1/collection/representative/metadata', function (done) {
    var fixture = require('./fixtures/representative-metadata.json');
    request
      .get('/api/v1/collection/representative/metadata')
      .expect(200, fixture, done);
  });

  it('POST /api/v1/collection', function (done) {
    var userAssemblyIds = [ '123.fa', '456.fa', '789.fa' ];
    registerCollection(userAssemblyIds)
      .expect(200)
      .expect(function (res) {
        assert(res.body.hasOwnProperty('collectionId'));
        userAssemblyIds.forEach(function (id) {
          assert(res.body.userAssemblyIdToAssemblyIdMap.hasOwnProperty(id));
        });
      })
      .end(done);
  });

  // TODO: Needs a Web Socket client and some dummy upload data
  it.skip('POST /api/v1/collection/tree/merge', function (done) {
    request
      .post('/api/v1/collection/tree/merge')
      .send({
        collectionId: 'a1de6463-a6b8-4810-bbe4-94d782d452c5',
        mergeWithCollectionId: '85974b89-fb99-4035-8eb6-74770d2dc794',
        socketRoomId: '123'
      })
      .expect(200, done);
  });

  // TODO: Needs a Web Socket client and some dummy upload data
  it.skip('POST /api/v1/collection/merged', function (done) {
    request
      .post('/api/v1/collection/merged')
      .send({
        mergeTreeId: '123',
        socketRoomId: '456'
      })
      .expect(200, done);
  });

});
