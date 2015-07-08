var assert = require('assert');
var _ = require('lodash');
var uuid = require('node-uuid');

describe('Collection Routes', function () {

  it('POST /collection', function (done) {
    var fixture = require('./fixtures/collection.json');
    request
      .post('/collection')
      .send({ collectionId: 'b8d3aab1-625f-49aa-9857-a5e97f5d6be5' })
      .expect(200, fixture, function (error, res) {
        if (error) { error.showDiff = false; }
        done(error, res);
      });
  });

  it('POST /collection [Error]', function (done) {
    request
      .post('/collection')
      .send({ collectionId: uuid.v4() })
      .expect(404, done);
  });

  it('POST /collection/add', function (done) {
    var userAssemblyIds = [ '123.fa', '456.fa', '789.fa' ];
    request
      .post('/collection/add')
      .send({
        userAssemblyIds: userAssemblyIds
      })
      .expect(200)
      .expect(function (res) {
        assert(res.body.hasOwnProperty('collectionId'));
        userAssemblyIds.forEach(function (id) {
          assert(_.includes(res.body.userAssemblyIdToAssemblyIdMap, id));
        });
      })
      .end(done);
  });

  it('GET /collection/new', function (done) {
    request
      .get('/collection/new')
      .expect(200, done);
  });

  it.skip('GET /api/collection/representative/metadata', function (done) {
    var fixture = require('./fixtures/representative-metadata.json');
    request
      .get('/api/collection/representative/metadata')
      .expect(200, fixture, done);
  });

  it('GET /collection/:id', function (done) {
    request
      .get('/collection/b8d3aab1-625f-49aa-9857-a5e97f5d6be5')
      .expect(200, done);
  });

  // TODO: Needs a Web Socket client and some dummy upload data
  it.skip('POST /api/collection/tree/merge', function (done) {
    request
      .post('/api/collection/tree/merge')
      .send({
        collectionId: 'a1de6463-a6b8-4810-bbe4-94d782d452c5',
        mergeWithCollectionId: '85974b89-fb99-4035-8eb6-74770d2dc794',
        socketRoomId: '123'
      })
      .expect(200, done);
  });

  // TODO: Needs a Web Socket client and some dummy upload data
  it.skip('POST /api/collection/merged', function (done) {
    request
      .post('/api/collection/merged')
      .send({
        mergeTreeId: '123',
        socketRoomId: '456'
      })
      .expect(200, done);
  });

});
