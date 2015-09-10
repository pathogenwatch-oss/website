var assert = require('assert');

describe('Download Routes', function () {

  it.only('GET /api/download/type/:idType/format/:fileFormat', function (done) {
    var url = '/api/download/type/assembly/format/fasta';
    request
      .post(url)
      .send({
        speciesId: '1280',
        idToFilenameMap: {
          'c3b35122-3625-4638-9091-2d73ad675e6d': 'DAVID_ASSEMBLY_1'
        },
        idList: 'c3b35122-3625-4638-9091-2d73ad675e6d'
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
