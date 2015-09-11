var assert = require('assert');

describe.only('Download Routes', function () {

  it('GET /api/download/type/:idType/format/:fileFormat', function (done) {
    var url = '/api/download/type/assembly/format/fasta';
    request
      .post(url)
      .send({
        speciesId: '1280',
        idToFilenameMap: {
          'c3b35122-3625-4638-9091-2d73ad675e6d': 'DAVID_ASSEMBLY_1'
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
  });

  it('GET /api/download/file/:fileName [ERROR]', function (done) {
    var url = '/api/download/file/QKN+LXimcfJwgGmQbenLRRh1EYE=.fsa';
    request
      .get(url)
      .expect(400, done);
  });

});
