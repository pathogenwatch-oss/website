var assert = require('assert');
var uuid = require('node-uuid');

var registerCollection = require('./features/register-collection');

describe('Collection Routes', function () {

  it('GET /api/species/:speciesId/collection/:id', function (done) {
    var fixture = require('./fixtures/collection.json');
    request
      .get('/api/species/1280/collection/1bd2dee3-e32c-4fb4-8d29-cb7be28f0028')
      .expect(200, fixture, function (error, res) {
        if (error) { error.showDiff = false; }
        console.log(JSON.stringify(error.actual, null, ' '));
        done(error, res);
      });
  });

  it('GET /api/species/:speciesId/collection/:id [Error]', function (done) {
    request
      .get('/api/species/1280/collection/' + uuid.v4())
      .expect(404, done);
  });

  it('GET /api/species/:speciesId/collection/:id/reference/', function (done) {
    var fixture = require('./fixtures/collection.json');
    request
      .get('/api/species/1280/collection/reference')
      .expect(200, {}, function (error, res) {
        if (error) { error.showDiff = false; }
        console.log(JSON.stringify(error.actual, null, ' '));
        done(error, res);
      });
  });

  // TODO: Needs fixture
  it('GET /api/species/:speciesId/collection/:collectionId/subtree/:id',
    function (done) {
      // var fixture = require('./fixtures/collection.json');
      request
        .get('/api/species/1280/collection/52ieg3ar069p/subtree/1280_TW20')
        .expect(200, {}, function (error, res) {
          if (error) { error.showDiff = false; }
          console.log(JSON.stringify(error.actual, null, ' '));
          done(error, res);
        });
    }
  );


  it('POST /api/species/1280/collection', function (done) {
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
