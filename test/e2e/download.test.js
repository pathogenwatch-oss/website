var assert = require('assert');

describe('Download Routes', function () {

  it('GET /api/download/type/:idType/format/:fileFormat', function (done) {
    var url = '/api/download/type/assembly/format/fasta';
    request
      .post(url)
      .send({
        '4ac4e326-6db3-410f-80c9-31eefe082d38': 'CT18'
      })
      .end(function (error, result) {
        if (error) return done(error);
        console.log(result.text);
        done();
      });
  });

  it.only('GET /api/download/file/:fileName', function (done) {
    var url = '/api/download/file/CT18.fsa';
    request
      .get(url)
      .end(function (error, result) {
        if (error) return done(error);
        console.log(result.text);
        done();
      });
  })

});
