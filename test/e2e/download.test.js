var assert = require('assert');

describe('Download Routes', function () {

  it('GET /api/species/:speciesId/download/type/:idType/format/:fileFormat', function (done) {
    var url = '/api/species/1280/download/type/assembly/format/fasta';
    request
      .post(url)
      .send({
        idToFilenameMap: {
          'MjZiM2NiOTEtMmQzZC00OG': 'DAVID_ASSEMBLY_1',
        },
      })
      .end(function (error, result) {
        if (error) return done(error);
        console.log(result.text);
        done();
      });
  });

  it('GET /api/species/:speciesId/download/file/:fileName', function (done) {
    var url = '/api/species/1280/download/file/fasta_SYS2jmj7l5rSw0yVb-vlWAYkK-YBwk_?prettyFileName=assembly.fa';
    request
      .get(url)
      .end(function (error, result) {
        if (error) return done(error);
        console.log(result.text);
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
