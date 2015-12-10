var assert = require('assert');
var uuid = require('node-uuid');

var registerCollection = require('./features/register-collection');

describe('Collection Routes', function () {

  it('GET /api/v1/collection/:id', function (done) {
    var fixture = require('./fixtures/collection.json');
    request
      .get('/api/v1/collection/1bd2dee3-e32c-4fb4-8d29-cb7be28f0028')
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

  it('GET /api/v1/collection/reference/:id', function (done) {
    var fixture = require('./fixtures/collection.json');
    request
      .get('/api/v1/collection/reference/1280')
      .expect(200, {}, function (error, res) {
        if (error) { error.showDiff = false; }
        console.log(JSON.stringify(error.actual, null, ' '));
        done(error, res);
      });
  });

  // TODO: Needs fixture
  it('GET /api/v1/collection/subtree/:id', function (done) {
    // var fixture = require('./fixtures/collection.json');
    request
      .get('/api/v1/collection/subtree/1280_TW20')
      .expect(200, {}, function (error, res) {
        if (error) { error.showDiff = false; }
        console.log(JSON.stringify(error.actual, null, ' '));
        done(error, res);
      });
  });


  it('POST /api/v1/collection', function (done) {
    var assemblyNames = [ '123.fa', '456.fa', '789.fa' ];
    registerCollection(assemblyNames)
      .expect(200)
      .expect(function (res) {
        assert(res.body.hasOwnProperty('collectionId'));
        assemblyNames.forEach(function (id) {
          assert(res.body.assemblyNameToAssemblyIdMap.hasOwnProperty(id));
        });
      })
      .end(done);
  });

});
