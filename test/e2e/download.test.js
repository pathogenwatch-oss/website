var assert = require('assert');

describe.only('Download Routes', function () {

  it('GET /api/download/type/:idType/format/:fileFormat', function (done) {
    var url = '/api/download/type/assembly/format/fasta';
    request
      .post(url)
      .send({
        speciesId: '1280',
        idToFilenameMap: {
          'e746908e-bad1-41c0-b74d-6364c7f0e681': 'CT18'
        }
      })
      .end(function (error, result) {
        if (error) return done(error);
        console.log(result.text);
        done();
      });
  });

  it('GET /api/download/file/:fileName', function (done) {
    var url = '/api/download/file/QKN+LXimcfJwgGmQbenLRRh1EYE=.fsa?prettyFileName=assembly.fa';
    request
      .get(url)
      .end(function (error, result) {
        if (error) return done(error);
        //console.log(result.text);
        done();
      });
  })

});
