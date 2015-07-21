var assert = require('assert');

describe('Download Routes', function () {

  it('GET /api/v1/download/assembly/:id/metadata/json', function (done) {
    var fixture = require('./fixtures/downloaded-metadata.json');
    var url = '/api/download/assembly' +
              '/a1de6463-a6b8-4810-bbe4-94d782d452c5/metadata/json';
    request
      .get(url)
      .end(function (error, result) {
        if (error) return done(error);
        assert.deepEqual(JSON.parse(result.text), fixture);
        done();
      });
  });

});
